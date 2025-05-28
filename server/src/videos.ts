// server/src/api/videos.ts
import { Router } from "../deps.ts";
import { YouTubeScraperService } from "./services/YoutubeScraperService.ts";

const router = new Router();
const ytScraper = new YouTubeScraperService();

router.get("videos/:id", async (ctx) => {
  const { id } = ctx.params;
  try {
    const video = await ytScraper.getVideoDetails(id);
    if (video) {
      ctx.response.body = video;
    } else {
      ctx.response.status = 404;
      ctx.response.body = { error: "Video not found" };
    }
  } catch (error:any) {
    ctx.response.status = 500;
    ctx.response.body = { error: error.message };
  }
});

export default router;