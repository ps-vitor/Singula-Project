// ./server/src/controllers/aulasControllers.ts

import { Context,RouterContext} from "../../deps.ts";
import { 
  scrapeChannelVideos, 
  searchYouTubeVideos, 
  formatVideoResponse,
  isValidYouTubeUrl,
  retryWithBackoff,
} from "../services/scraperService.ts";
import { YouTubeScraperService } from "../services/YoutubeScraperService.ts";
import { logger } from "../middleware/logger.ts";
import { VideoAula } from '../../../shared/types.ts';

// Configurações padrão do controller
const DEFAULT_CHANNEL_URL = "https://www.youtube.com/@Pr.Singula/videos";
const DEFAULT_MAX_RESULTS = 20;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos em milissegundos

// Interface para estrutura do cache
interface CacheEntry {
  data: VideoAula[];
  timestamp: number;
  url: string;
}

// Cache simples em memória (ideal usar Redis em produção)
const cache = new Map<string, CacheEntry>();

// Instância do serviço de scraping com 3 tentativas e max 50 vídeos
const scraperService = new YouTubeScraperService(3, 50);

// Remove entradas expiradas do cache
function cleanExpiredCache(): void {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (now - entry.timestamp > CACHE_DURATION) {
      cache.delete(key);
    }
  }
}

// Obtém dados do cache se disponíveis e válidos
function getCachedData(key: string): VideoAula[] | null {
  cleanExpiredCache();
  const entry = cache.get(key);
  
  if (entry && Date.now() - entry.timestamp < CACHE_DURATION) {
    logger.info(`Cache hit para: ${key}`);
    return entry.data;
  }
  
  return null;
}

// Salva dados no cache
function setCachedData(key: string, data: VideoAula[], url: string): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    url
  });
  logger.info(`Dados cached para: ${key} (${data.length} itens)`);
}

// Valida os parâmetros query maxResults e forceRefresh
function validateQueryParams(ctx: Context) {
  const url = ctx.request.url;
  const maxResults = url.searchParams.get('maxResults');
  const forceRefresh = url.searchParams.get('forceRefresh') === 'true';
  
  let parsedMaxResults = DEFAULT_MAX_RESULTS;
  
  if (maxResults) {
    const parsed = parseInt(maxResults);
    if (isNaN(parsed) || parsed < 1 || parsed > 100) {
      throw new Error('maxResults deve ser um número entre 1 e 100');
    }
    parsedMaxResults = parsed;
  }
  
  return { maxResults: parsedMaxResults, forceRefresh };
}

// Retorna resposta de erro padronizada
function errorResponse(ctx: Context, status: number, message: string, error?: unknown) {
  logger.error(`Erro ${status}: ${message}`, error);
  
  ctx.response.status = status;
  ctx.response.body = {
    success: false,
    error: message,
    details: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error && Deno.env.get('NODE_ENV') !== 'production' 
      ? error.stack 
      : undefined,
    timestamp: new Date().toISOString()
  };
}

// Retorna resposta de sucesso padronizada
function successResponse(ctx: Context, data: VideoAula[], metadata?: Record<string, any>) {
  ctx.response.status = 200;
  ctx.response.body = {
    success: true,
    total: data.length,
    data,
    metadata: {
      timestamp: new Date().toISOString(),
      cached: metadata?.cached || false,
      source: metadata?.source || 'scraping',
      ...metadata
    }
  };
}

/**   
 * Lista aulas do canal padrão
 * GET /api/aulas
 * Query params: maxResults, forceRefresh
 */
export const listarAulas = async (ctx: Context) => {
  const startTime = Date.now();
  
  try {
    const { maxResults, forceRefresh } = validateQueryParams(ctx);
    const cacheKey = `channel_${DEFAULT_CHANNEL_URL}_${maxResults}`;
    
    logger.info(`Listando aulas do canal padrão (max: ${maxResults}, forceRefresh: ${forceRefresh})`);
    
    // Verificar cache se não for refresh forçado
    if (!forceRefresh) {
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        return successResponse(ctx, cachedData, { 
          cached: true,
          processingTime: Date.now() - startTime
        });
      }
    }
    
    // Scraping dos dados com retry/backoff
    const aulas = await retryWithBackoff(
      async () => {
        const rawData = await scrapeChannelVideos(DEFAULT_CHANNEL_URL, maxResults);
        return formatVideoResponse(rawData);
      },
      3,
      2000
    );
    
    // Salvar no cache
    setCachedData(cacheKey, aulas, DEFAULT_CHANNEL_URL);
    
    logger.info(`Scraping concluído: ${aulas.length} aulas obtidas em ${Date.now() - startTime}ms`);
    
    successResponse(ctx, aulas, {
      processingTime: Date.now() - startTime,
      source: DEFAULT_CHANNEL_URL
    });
    
  } catch (error) {
    errorResponse(ctx, 500, 'Erro ao obter as aulas', error);
  }
};

/**
 * Lista aulas de um canal específico
 * POST /api/aulas/canal
 * Body: { channelUrl: string, maxResults?: number }
 */
export const listarAulasCanal = async (ctx: Context) => {
  const startTime = Date.now();
  
  try {
    const body = await ctx.request.body.json()

    const { channelUrl, maxResults = DEFAULT_MAX_RESULTS } = body;
    
    if (!channelUrl || typeof channelUrl !== 'string') {
      return errorResponse(ctx, 400, 'URL do canal é obrigatória');
    }
    
    if (!isValidYouTubeUrl(channelUrl)) {
      return errorResponse(ctx, 400, 'URL do YouTube inválida');
    }
    
    if (maxResults < 1 || maxResults > 100) {
      return errorResponse(ctx, 400, 'maxResults deve ser entre 1 e 100');
    }
    
    const cacheKey = `channel_${channelUrl}_${maxResults}`;
    logger.info(`Listando aulas do canal: ${channelUrl} (max: ${maxResults})`);
    
    // Verificar cache
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return successResponse(ctx, cachedData, { 
        cached: true,
        processingTime: Date.now() - startTime,
        source: channelUrl
      });
    }
    
    // Scraping dos dados via serviço
    const aulas = await scraperService.getChannelVideos(channelUrl);
    const limitedAulas = aulas.slice(0, maxResults);
    
    // Salvar no cache
    setCachedData(cacheKey, limitedAulas, channelUrl);
    
    logger.info(`Canal processado: ${limitedAulas.length} aulas obtidas em ${Date.now() - startTime}ms`);
    
    successResponse(ctx, limitedAulas, {
      processingTime: Date.now() - startTime,
      source: channelUrl,
      totalFound: aulas.length,
      limited: aulas.length > maxResults
    });
    
  } catch (error) {
    errorResponse(ctx, 500, 'Erro ao obter aulas do canal', error);
  }
};

/**
 * Busca aulas por termo
 * GET /api/aulas/buscar?q=termo&maxResults=10
 */
export const buscarAulas = async (ctx: Context) => {
  const startTime = Date.now();
  
  try {
    const url = ctx.request.url;
    const query = url.searchParams.get('q');
    const maxResults = parseInt(url.searchParams.get('maxResults') || '10');
    
    if (!query || query.trim().length === 0) {
      return errorResponse(ctx, 400, 'Parâmetro de busca "q" é obrigatório');
    }
    
    if (maxResults < 1 || maxResults > 50) {
      return errorResponse(ctx, 400, 'maxResults deve ser entre 1 e 50');
    }
    
    const cacheKey = `search_${query.trim()}_${maxResults}`;
    logger.info(`Buscando aulas: "${query}" (max: ${maxResults})`);
    
    // Verificar cache
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return successResponse(ctx, cachedData, { 
        cached: true,
        processingTime: Date.now() - startTime,
        query: query.trim()
      });
    }
    
    // Buscar dados via serviço
    const aulas = await scraperService.searchVideos(query.trim(), maxResults);
    
    // Salvar no cache
    setCachedData(cacheKey, aulas, `search:${query}`);
    
    logger.info(`Busca concluída: ${aulas.length} aulas encontradas em ${Date.now() - startTime}ms`);
    
    successResponse(ctx, aulas, {
      processingTime: Date.now() - startTime,
      query: query.trim(),
      searchTerms: query.trim().split(' ')
    });
    
  } catch (error) {
    errorResponse(ctx, 500, 'Erro na busca de aulas', error);
  }
};

/**
 * Obter detalhes de uma aula específica
 * GET /api/aulas/:videoId
 */
export const obterAula = async (ctx: RouterContext<string>) => {
  const startTime = Date.now();
  
  try {
    const { videoId } = ctx.params;
    
    if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return errorResponse(ctx, 400, 'ID do vídeo inválido');
    }
    
    const cacheKey = `video_${videoId}`;
    logger.info(`Obtendo detalhes da aula: ${videoId}`);
    
    // Verificar cache
    const cachedData = getCachedData(cacheKey);
    if (cachedData && cachedData.length > 0) {
      return successResponse(ctx, cachedData, { 
        cached: true,
        processingTime: Date.now() - startTime
      });
    }
    
    // Obter detalhes via serviço de scraping
    const aulaDetalhes = await scraperService.getVideoDetails(videoId);
    if (!aulaDetalhes) {
      return errorResponse(ctx, 404, 'Vídeo não encontrado');
    }
    
    // Salvar no cache
    setCachedData(cacheKey, [aulaDetalhes], `video:${videoId}`);
    
    logger.info(`Detalhes da aula obtidos em ${Date.now() - startTime}ms`);
    
    successResponse(ctx, [aulaDetalhes], {
      processingTime: Date.now() - startTime
    });
    
  } catch (error) {
    errorResponse(ctx, 500, 'Erro ao obter detalhes da aula', error);
  }
};
