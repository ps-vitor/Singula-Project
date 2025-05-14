import type { YoutubeData } from '@/services/scraperService';

export const scrapeChannelVideos = jest.fn<Promise<YoutubeData[]>, [string]>();
