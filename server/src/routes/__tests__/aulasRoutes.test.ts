import request from 'supertest';
import { app, configureApp } from '@/index';
import *  as  scraperService from "@/services/scraperService";
import  {YoutubeData} from  "@/services/scraperService"

jest.mock("@/services/scraperService");
const mockedScraper=scraperService.scrapeChannelVideos as  jest.Mock<Promise<YoutubeData[]>,[string]>;

describe("GET /aulas", () => {
    beforeAll(async () => {
        await configureApp();
    });

    beforeEach(() => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      (scraperService.scrapeChannelVideos as  jest.Mock).mockClear();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("deve retornar 200 com lista de aulas", async () => {
      (scraperService.scrapeChannelVideos as  jest.Mock).mockResolvedValue([
          {
            videoId: "123", 
            titulo: "Aula 1", 
            descricao:" ",
            videoUrl:" ",
            imgUrl:" ",
          }
        ]);

        const response = await request(app)
          .get("/aulas")
          .expect(200);

        expect(response.body).toEqual([
          {
            videoId: "123", 
            titulo: "Aula 1", 
            descricao:" ",
            videoUrl:" ",
            imgUrl:" ",
          }
        ]);
    });

    it("deve retornar 500 se o scraping falhar", async () => {
        (scraperService.scrapeChannelVideos as  jest.Mock)  
          .mockRejectedValue(new Error("Erro"));

        await request(app)
            .get("/aulas")
            .expect(500)
            .expect({
              code: "YT_SCRAPE_FAILED",
              mensagem: "Erro ao buscar aulas"
            });
      
        expect(console.error).toHaveBeenCalledWith(
            expect.stringContaining("Erro ao buscar aulas"),
            expect.any(Error)
        );
    });
});