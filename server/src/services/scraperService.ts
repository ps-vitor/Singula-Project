// ./server/src/services/scraperService.ts

import axios from "https://esm.sh/axios";
import { cheerio } from "../../deps.ts";
import type { Element } from "../../deps.ts";
import { logger } from "../middleware/logger.ts";
import { VideoAula } from '../../../shared/types.ts';

export interface YoutubeData {
  videoId: string;
  titulo: string;
  descricao: string;
  videoUrl: string;
  imgUrl: string;
  duracao?: string;
  canal?: string;
}

const SCRAPE_TIMEOUT = 15000;
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
const BATCH_SIZE = 5; // Processar 5 vídeos por vez
const DELAY_BETWEEN_REQUESTS = 1000; // 1 segundo entre requests

// Função auxiliar para delay
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Função auxiliar para extrair ID do vídeo
function extractVideoId(url: string): string | null {
  const patterns = [
    /[?&]v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /embed\/([^?]+)/,
    /shorts\/([^?]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1].substring(0, 11); // YouTube video IDs são sempre 11 caracteres
  }
  
  return null;
}

// Função auxiliar para injeção de dependência (útil para testes)
async function fetchHtml(url: string): Promise<string> {
  try {
    const { data } = await axios.get(url, {
      timeout: SCRAPE_TIMEOUT,
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
      }
    });
    return data;
  } catch (err: any) {
    logger.error(`Falha ao buscar URL ${url}: ${err.message}`);
    throw new Error(`SCRAPE_FAILED: ${err.message}`);
  }
}

async function scrapeChannelVideos(
  channelUrl: string,
  maxVideos: number = 20,
  httpClient = fetchHtml
): Promise<YoutubeData[]> {
  if (!channelUrl.includes("youtube.com")) {
    throw new Error("URL_INVALIDA");
  }

  try {
    logger.info(`Iniciando scraping do canal: ${channelUrl}`);
    
    // Garantir que estamos na página de vídeos do canal
    const videosUrl = channelUrl.includes('/videos') 
      ? channelUrl 
      : `${channelUrl.replace(/\/$/, '')}/videos`;
    
    const html = await httpClient(videosUrl);
    const $ = cheerio.load(html);
    
    const videoIds: string[] = [];
    
    // Método 1: Extrair de links de vídeos
    $('a[href*="/watch?v="]').each((_i: number, el: Element) => {
      const href = $(el).attr("href");
      if (href) {
        const videoId = extractVideoId(href);
        if (videoId && !videoIds.includes(videoId)) {
          videoIds.push(videoId);
        }
      }
    });

    // Método 2: Extrair do JavaScript (ytInitialData)
    if (videoIds.length === 0) {
      const scripts = $('script').toArray();
      
      for (const script of scripts) {
        const content = $(script).html();
        if (content && content.includes('var ytInitialData = ')) {
          try {
            const jsonStr = content.split('var ytInitialData = ')[1].split(';</script>')[0];
            const ytInitialData = JSON.parse(jsonStr);
            
            // Navegar pela estrutura do YouTube para encontrar vídeos
            const tabs = ytInitialData?.contents?.twoColumnBrowseResultsRenderer?.tabs || [];
            
            for (const tab of tabs) {
              const tabRenderer = tab.tabRenderer;
              if (tabRenderer?.title === "Videos" || tabRenderer?.title === "Vídeos") {
                const contents = tabRenderer?.content?.richGridRenderer?.contents || [];
                
                for (const item of contents) {
                  if (item.richItemRenderer?.content?.videoRenderer) {
                    const videoData = item.richItemRenderer.content.videoRenderer;
                    if (videoData.videoId && !videoIds.includes(videoData.videoId)) {
                      videoIds.push(videoData.videoId);
                    }
                  }
                }
                break;
              }
            }
            break;
          } catch (e) {
            logger.debug("Erro ao parsear ytInitialData:", e);
            continue;
          }
        }
      }
    }

    // Método 3: Buscar por padrões específicos no HTML
    if (videoIds.length === 0) {
      const videoIdMatches = html.match(/\"videoId\":\"([a-zA-Z0-9_-]{11})\"/g);
      if (videoIdMatches) {
        for (const match of videoIdMatches.slice(0, maxVideos)) {
          const videoId = match.replace(/\"videoId\":\"/, '').replace(/\"/, '');
          if (!videoIds.includes(videoId)) {
            videoIds.push(videoId);
          }
        }
      }
    }

    const uniqueVideoIds = [...new Set(videoIds)].slice(0, maxVideos);
    logger.info(`Encontrados ${uniqueVideoIds.length} vídeos únicos`);

    if (uniqueVideoIds.length === 0) {
      logger.warning("Nenhum vídeo encontrado. Possível mudança na estrutura do YouTube.");
      return [];
    }

    // Processar vídeos em lotes para evitar sobrecarga
    const videos: YoutubeData[] = [];
    
    for (let i = 0; i < uniqueVideoIds.length; i += BATCH_SIZE) {
      const batch = uniqueVideoIds.slice(i, i + BATCH_SIZE);
      logger.info(`Processando lote ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(uniqueVideoIds.length / BATCH_SIZE)}`);
      
      const batchPromises = batch.map(async (videoId, index) => {
        // Delay progressivo para evitar rate limiting
        await delay(index * 200);
        
        try {
          return await processVideo(videoId, httpClient);
        } catch (error: any) {
          logger.error(`Erro ao processar vídeo ${videoId}: ${error.message}`);
          // Retorna dados básicos mesmo se falhar
          return {
            videoId,
            titulo: `Vídeo ${videoId}`,
            descricao: "Descrição não disponível",
            videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
            imgUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          };
        }
      });

      const batchResults = await Promise.allSettled(batchPromises);
      
      for (const result of batchResults) {
        if (result.status === 'fulfilled' && result.value) {
          videos.push(result.value);
        }
      }

      // Delay entre lotes
      if (i + BATCH_SIZE < uniqueVideoIds.length) {
        await delay(DELAY_BETWEEN_REQUESTS);
      }
    }

    logger.info(`Scraping concluído. ${videos.length} vídeos processados com sucesso`);
    return videos;

  } catch (err: any) {
    logger.error(`Erro no scraping: ${err.message}`);
    throw err;
  }
}


interface HttpClient {
  (url: string): Promise<string>;
}

async function processVideo(id: string, httpClient: HttpClient): Promise<YoutubeData> {
  const startTime = Date.now();
  const url = `https://www.youtube.com/watch?v=${id}`;
  
  try {
    const videoHtml = await httpClient(url);
    const $ = cheerio.load(videoHtml);

    // Extrair informações básicas
    let titulo = $('meta[property="og:title"]').attr("content") || 
                 $('meta[name="title"]').attr("content") || 
                 $('title').text().replace(' - YouTube', '') || 
                 `Vídeo ${id}`;

    let descricao = $('meta[property="og:description"]').attr("content") || 
                    $('meta[name="description"]').attr("content") || 
                    "";

    let duracao = $('meta[itemprop="duration"]').attr("content") || "";
    let canal = "";

    // Extrair informações adicionais do JSON do player
    const scripts = $('script').toArray();
    
    for (const script of scripts) {
      const content = $(script).html();
      if (content && content.includes('var ytInitialPlayerResponse = ')) {
        try {
          const jsonStr = content.split('var ytInitialPlayerResponse = ')[1].split(';</script>')[0];
          const playerResponse = JSON.parse(jsonStr);
          
          const videoDetails = playerResponse?.videoDetails;
          if (videoDetails) {
            titulo = videoDetails.title || titulo;
            descricao = videoDetails.shortDescription || descricao;
            canal = videoDetails.author || canal;
            duracao = videoDetails.lengthSeconds || duracao;
          }
          break;
        } catch (e) {
          logger.debug(`Erro ao parsear player response para ${id}:`, e);
          continue;
        }
      }
    }

    // Converter duração de segundos para formato MM:SS
    if (duracao && !isNaN(Number(duracao))) {
      const totalSeconds = parseInt(duracao);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      duracao = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    logger.debug(`Processado vídeo ${id} em ${Date.now() - startTime}ms`);

    return {
      videoId: id,
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      videoUrl: `https://www.youtube.com/watch?v=${id}`,
      imgUrl: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
      duracao,
      canal: canal.trim(),
    };

  } catch (error: any) {
    logger.error(`Erro ao processar vídeo ${id}: ${error.message}`);
    throw error;
  }
}

// Função para buscar vídeos por termo de pesquisa
async function searchYouTubeVideos(
  query: string,
  maxResults: number = 10,
  httpClient = fetchHtml
): Promise<YoutubeData[]> {
  try {
    logger.info(`Buscando vídeos para: "${query}"`);
    
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    const html = await httpClient(searchUrl);
    const $ = cheerio.load(html);
    
    const videos: YoutubeData[] = [];
    
    // Extrair dados do ytInitialData
    const scripts = $('script').toArray();
    
    for (const script of scripts) {
      const content = $(script).html();
      if (content && content.includes('var ytInitialData = ')) {
        try {
          const jsonStr = content.split('var ytInitialData = ')[1].split(';</script>')[0];
          const ytInitialData = JSON.parse(jsonStr);
          
          const contents = ytInitialData?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];
          
          for (const item of contents) {
            if (item.videoRenderer && videos.length < maxResults) {
              const videoData = item.videoRenderer;
              
              videos.push({
                videoId: videoData.videoId,
                titulo: videoData.title?.runs?.[0]?.text || "Título não disponível",
                descricao: videoData.descriptionSnippet?.runs?.[0]?.text || "",
                videoUrl: `https://www.youtube.com/watch?v=${videoData.videoId}`,
                imgUrl: videoData.thumbnail?.thumbnails?.[0]?.url || `https://img.youtube.com/vi/${videoData.videoId}/maxresdefault.jpg`,
                duracao: videoData.lengthText?.simpleText || "",
                canal: videoData.ownerText?.runs?.[0]?.text || ""
              });
            }
          }
          break;
        } catch (e) {
          logger.debug("Erro ao parsear dados de busca:", e);
          continue;
        }
      }
    }
    
    logger.info(`Encontrados ${videos.length} vídeos na busca`);
    return videos;
    
  } catch (error: any) {
    logger.error(`Erro na busca: ${error.message}`);
    throw error;
  }
}

function formatVideoResponse(videos: YoutubeData[]): VideoAula[] {
  return videos.map(video => ({
    id: video.videoId,
    titulo: video.titulo,
    descricao: video.descricao,
    url: video.videoUrl,
    thumbnail: video.imgUrl,
    duracao: video.duracao,
    videoId: video.videoId,
    videoUrl: video.videoUrl,
    imgUrl: video.imgUrl,
    canal: video.canal,
  }));
}

// Função utilitária para validar URL do YouTube
function isValidYouTubeUrl(url: string): boolean {
  const patterns = [
    /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
    /^https?:\/\/(www\.)?youtube\.com\/channel\/[\w-]+/,
    /^https?:\/\/(www\.)?youtube\.com\/c\/[\w-]+/,
    /^https?:\/\/(www\.)?youtube\.com\/@[\w-]+/,
    /^https?:\/\/youtu\.be\/[\w-]+/
  ];
  
  return patterns.some(pattern => pattern.test(url));
}

// Função para retry com backoff exponencial
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      if (attempt === maxRetries) {
        break;
      }
      
      const delayMs = baseDelay * Math.pow(2, attempt);
      logger.warning(`Tentativa ${attempt + 1} falhou, tentando novamente em ${delayMs}ms: ${error.message}`);
      await delay(delayMs);
    }
  }
  
  throw lastError!;
}

export{
  extractVideoId,
  fetchHtml,
  scrapeChannelVideos,
  processVideo,
  searchYouTubeVideos,
  formatVideoResponse,
  isValidYouTubeUrl,
  retryWithBackoff,
}