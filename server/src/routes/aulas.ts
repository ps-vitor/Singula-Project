// ./server/src/routes/aulas.ts
import { Router } from "../../deps.ts";
import { YouTubeScraperService } from "../services/YoutubeScraperService.ts";
import { VideoAula } from '../../../shared/types.ts';

const aulasRouter = new Router();
const ytScraper = new YouTubeScraperService();

aulasRouter.get("/aulas", async (ctx) => {
  try {
    const channelUrl = "https://www.youtube.com/@Pr.Singula/videos";
    const videos = await ytScraper.getChannelVideos(channelUrl);
    
    if (!videos || videos.length === 0) {
      ctx.response.status = 404;
      ctx.response.body = {
        success: false,
        error: "No videos found or scraping failed"
      };
      return;
    }
    
    ctx.response.body = {
      success: true,
      data: videos
    };
  } catch (error) {
    console.error("Scraping error:", error); // Detailed logging
    ctx.response.status = 500;
    ctx.response.body = {
      success: false,
      error: "Failed to scrape YouTube channel. Details in server logs."
    };
  }
});

export default aulasRouter;