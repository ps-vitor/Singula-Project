import { Response } from 'express';
import { scrapeChannelVideos } from "@/services/scraperService";

export type MockResponse = Partial<Response> & {
  [key: string]: any;
  status: jest.Mock<MockResponse, [number]>;
  json: jest.Mock<MockResponse, [any]>;
  send: jest.Mock<MockResponse, [any]>;
};

export type MockedScraper = jest.MockedFunction<typeof scrapeChannelVideos>;