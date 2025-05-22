// ./server/src/routes/aulas.ts

import { Router } from "../../deps.ts";
import { listarAulas } from "../controllers/aulasController.ts"; // .ts explícito
import  {Context}   from    "../../deps.ts"
import  {scrapeChannelVideos,formatVideoResponse,}   from    "../services/scraperService.ts";
import { VideoAula } from "../../../shared/types.ts";

const router=new  Router();

let cachedAulas:VideoAula[]=[];
let lastUpdate:Date | null=null;
const CACHE_TTL=1000*60*30

router.post("/atualizar", async (ctx) => {
  try {
    const channelUrl = "https://www.youtube.com/user/SEU_CANAL/videos";
    const scrapedVideos = await scrapeChannelVideos(channelUrl);
    cachedAulas = formatVideoResponse(scrapedVideos);
    lastUpdate = new Date();
    
    ctx.response.body = {
      success: true,
      message: "Cache atualizado com sucesso",
      total: cachedAulas.length
    };
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      success: false,
      error: "Falha ao atualizar cache"
    };
  }
});

router.get('/', async (ctx) => {
  try {
    if (!lastUpdate || (Date.now() - lastUpdate.getTime()) > CACHE_TTL) {
      // Remova a primeira chamada desnecessária
      const channelUrl = 'https://www.youtube.com/@Pr.Singula/videos';
      const scrapedVideos = await scrapeChannelVideos(channelUrl);
      cachedAulas = formatVideoResponse(scrapedVideos);
      lastUpdate = new Date();
    }

    ctx.response.body = {
      success: true,
      total: cachedAulas.length,
      data: cachedAulas,
    };
  } catch (error: any) {
    console.error("Erro no endpoint /aulas:", error);
    ctx.response.status = 500;
    ctx.response.body = {
      success: false,
      error: `Erro ao buscar vídeos ${error.message}`,
    };
  }
});


export default router;