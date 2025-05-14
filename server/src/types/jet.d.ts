import { scrapeChannelVideos } from "@/services/scraperService";

declare global {
  namespace jest {
    interface Mock {
      mockResolvedValue(value: Awaited<ReturnType<typeof scrapeChannelVideos>>): this;
      mockRejectedValue(value: unknown): this;
    }
  }
}
