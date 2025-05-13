import  {listarAulas}   from    "../aulasController";
import  {Request,Response}from "express";
import  {mockResponse}  from    "../../test-utils/mockResponse";

jest.mock("../../services/scraperService");

describe("aulasController",()=>{
    it("deve retornar 500 se o scraping falhar",async()=>{
        const   req={}as    Request;
        const   res=mockResponse();

        require("../../services/scraperService").scrapeChannelVideos.mockRejectedValue(
            new Error("Erro de scraping")
        );

        await   listarAulas(req,res as  Response);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            mensage:"Erro ao buscar aulas"
        });
    });
});
