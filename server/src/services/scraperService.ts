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
}

// Função auxiliar para injeção de dependência (útil para testes)
async function fetchHtml(url: string): Promise<string> {
  const { data } = await axios.get(url, {
    timeout: 10000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  return data;
}

export async function scrapeChannelVideos(
  channelUrl: string,
  httpClient = fetchHtml
): Promise<YoutubeData[]> {
  if (!channelUrl.includes("youtube.com")) {
    throw new Error("URL_INVALIDA");
  }

  try {
    // Fazer requisição para a URL do canal
    const html = await httpClient(channelUrl);
    
    const $ = cheerio.load(html);
    const videoIds = new Set<string>();

    // Buscar por links de vídeos no HTML
    $('a[href*="/watch?v="]').each((_i: number, el: Element) => {
      const href = $(el).attr("href");
      const match = href?.match(/v=([a-zA-Z0-9_-]{11})/);
      if (match?.[1]) {
        videoIds.add(match[1]);
      }
    });

    console.log(`Encontrados ${videoIds.size} vídeos únicos`);

    const videos: YoutubeData[] = [];

    // Processar cada vídeo encontrado
    await Promise.all(
      Array.from(videoIds).map(async (id) => {
        try {
          const url = `https://www.youtube.com/watch?v=${id}`;
          const videoUrl = `https://www.youtube.com/embed/${id}`;
          const imgUrl = `https://img.youtube.com/vi/${id}/0.jpg`;

          const videoHtml = await httpClient(url);

          const $ = cheerio.load(videoHtml);
          const titulo = $('meta[name="title"]').attr("content") || 
                        $('title').text() || 
                        `Vídeo ${id}`;
          const descricao = $('meta[name="description"]').attr("content") || "";

          videos.push({
            videoId: id,
            titulo: titulo.trim(),
            descricao: descricao.trim(),
            videoUrl,
            imgUrl,
          });
        } catch (error) {
          logger.error(`Error processing video ${id}: ${String(error)}`);
        }
      })
    );

    return videos;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`Error scraping channel: ${errorMessage}`);
    throw error;
  }
}

export  function  formatVideoResponse(videos:YoutubeData[]):VideoAula[]{
  return  videos.map(video=>({
    id:video.videoId,
    ...video
  }));
}
