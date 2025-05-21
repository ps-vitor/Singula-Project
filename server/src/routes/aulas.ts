// ./server/src/routes/aulas.ts

import { Router } from "../../deps.ts";
import { listarAulas } from "../controllers/aulasController.ts"; // .ts explícito
import  {Context}   from    "../../deps.ts"
import  {scrapeChannelVideos,formatVideoResponse}   from    "../services/scraperService.ts";

const router=new  Router();

router.get('/aulas', async (ctx) => {
  try {
    const videos = await scrapeChannelVideos('https://www.youtube.com/@Pr.Singula/videos');
    ctx.response.body = {
      success: true,
      total: videos.length,
      data: formatVideoResponse(videos)
    };
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      success: false,
      error: 'Erro ao buscar vídeos'
    };
  }
});


export default router;