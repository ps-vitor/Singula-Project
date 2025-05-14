import  {listarAulas}   from    "@/controllers/aulasController";
import  {Request}from "express";
import  {mockResponse}  from    "@/test-utils/mockResponse";
import  *  as  scraperService from "@/services/scraperService";
import  {YoutubeData} from    "@/services/scraperService"
import { MockedScraper } from '@/test-utils/types';

jest.mock("@/services/scraperService");
const mockedScraper=scraperService.scrapeChannelVideos as  jest.Mock<Promise<YoutubeData[]>,[string]>;

describe("aulasController",()=>{
    it("deve retornar 500 se o scraping falhar",async()=>{
        const   req={}as    Request;
        const   res=mockResponse();

        (scraperService.scrapeChannelVideos as  jest.Mock).mockRejectedValue(
            new Error("Erro no scraping")
        )

        await   listarAulas(req,res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            code:"YT_SCRAPE_FAILED",
            mensagem:"Erro ao buscar aulas"
        });
    });
});
