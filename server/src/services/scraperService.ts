// ./server/src/services/scraperService.ts
import axios from "https://esm.sh/axios@1.6.2";  // Importação correta do axios
import { load,Element } from "https://esm.sh/cheerio@1.0.0-rc.12";
import { logger } from "../middleware/logger.ts";
import  {cheerio} from  "../../deps.ts";

export interface YoutubeData {
  videoId: string;
  titulo: string;
  descricao: string;
  videoUrl: string;
  imgUrl: string;
}

export async function scrapeChannelVideos(
  channelUrl: string
): Promise<YoutubeData[]> {
  if (!channelUrl.includes("youtube.com")) {
    throw new Error("URL_INVALIDA");
  }

  try {
    const { data: html } = await axios.get(channelUrl, {
      timeout: 1000,
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const $ = cheerio.load(html);
    const videoIds = new Set<string>();

    $('a[href*="/watch?v="]').each((_i: number, el: Element) => {
      const href = $(el).attr("href");
      const match = href?.match(/v=([a-zA-Z0-9_-]{11})/);
      if (match?.[1]) {
        videoIds.add(match[1]);
      }
    });

    const videos: YoutubeData[] = [];

    await Promise.all(
      Array.from(videoIds).map(async (id) => {
        try {
          const url = `https://www.youtube.com/watch?v=${id}`;
          const videoUrl = `https://www.youtube.com/embed/${id}`;
          const imgUrl = `https://img.youtube.com/vi/${id}/0.jpg`;

          const { data: videoHtml } = await axios.get(url, {
            timeout: 5000,
          });

          const $$ = load(videoHtml);
          const titulo = $$('meta[name="title"]').attr("content") || "";
          const descricao = $$('meta[name="description"]').attr("content") || "";

          videos.push({
            videoId: id,
            titulo,
            descricao,
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
    logger.error(`Error: ${errorMessage}`);
    throw error;
  }
}