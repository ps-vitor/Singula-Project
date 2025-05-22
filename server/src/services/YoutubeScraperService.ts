import { logger } from "../middleware/logger.ts";
import { VideoAula } from '../../../shared/types.ts';
import  *   as  scraper   from    '../scrapeChannelVideos';

export class YouTubeScraperService {
  constructor(
    private maxRetries: number = 3,
    private maxVideosPerChannel: number = 20
  ) {}

  async getChannelVideos(channelUrl: string): Promise<VideoAula[]> {
    try {
      const videos = await scraper.retryWithBackoff(
        () => scraper.scrapeChannelVideos(channelUrl, this.maxVideosPerChannel),
        this.maxRetries
      );
      
      return scraper.formatVideoResponse(videos);
    } catch (error: any) {
      logger.error(`Erro ao obter vídeos do canal ${channelUrl}: ${error.message}`);
      throw new Error(`CHANNEL_SCRAPE_FAILED: ${error.message}`);
    }
  }

  async searchVideos(query: string, maxResults: number = 10): Promise<VideoAula[]> {
    try {
      const videos = await scraper.retryWithBackoff(
        () => scraper.searchYouTubeVideos(query, maxResults),
        this.maxRetries
      );
      
      return scraper.formatVideoResponse(videos);
    } catch (error: any) {
      logger.error(`Erro na busca "${query}": ${error.message}`);
      throw new Error(`SEARCH_FAILED: ${error.message}`);
    }
  }

  async getVideoDetails(videoId: string): Promise<VideoAula | null> {
    try {
      const video = await scraper.retryWithBackoff(
        () => scraper.processVideo(videoId, scraper.fetchHtml),
        this.maxRetries
      );
      
      const formatted = scraper.formatVideoResponse([video]);
      return formatted[0] || null;
    } catch (error: any) {
      logger.error(`Erro ao obter detalhes do vídeo ${videoId}: ${error.message}`);
      return null;
    }
  }
}