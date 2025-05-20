// ./server/src/controllers/aulasControllers.ts

import { Context } from "https://deno.land/x/oak/mod.ts";
import { scrapeChannelVideos } from "../services/scraperService.ts";

export const listarAulas = async (ctx: Context) => {
  try {
    const channelUrl="https://www.youtube.com/@Pr.Singula/videos"
    const aulas = await scrapeChannelVideos(channelUrl);
    ctx.response.status = 200;
    ctx.response.body = aulas;
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { 
      error: `Erro ao obter as aulas: ${error}`,
      details:error instanceof  Error?error.message:String(error)
    };
  }
};
