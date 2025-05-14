// ./server/src/controllers/aulasControllers.ts

import { Context } from "https://deno.land/x/oak/mod.ts";
import { scraperChannelVideos } from "../services/scraperService.ts";

export const listarAulas = async (ctx: Context) => {
  try {
    const aulas = await scraperChannelVideos();
    ctx.response.status = 200;
    ctx.response.body = aulas;
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { error: "Erro ao obter as aulas" };
  }
};
