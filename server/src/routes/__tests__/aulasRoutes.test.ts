import  request from    "supertest";
import  {app,configureApp}   from    '../../index'
import  {scrapeChannelVideos}    from    "../../services/scraperService";

beforeAll(()=>{
    configureApp();
})

jest.mock("../../services/scraperService");

describe("GET /aulas",()=>{
    it("deve retornar 200 com lista de aulas",async()=>{
        (scrapeChannelVideos    as  jest.Mock).mockResolvedValue([
            {
                videoId:    "123",
                titulo: "Aula 1"
            }
        ]);

        const   response=await  request(app)
            .get("/aulas")
            .expect(200);

        expect(response.body).toEqual([
            {
                id: 1,
                videoId:    "123",
                titulo: "Aula 1"
            }
        ]);
    });

    it("deve retornar 500 se o scraping falhar",async()=>{
        (scrapeChannelVideos    as  jest.Mock).mockRejectedValue(new    Error("Erro"));

        await   request(app)
            .get("/aulas")
            .expect(500)
            .expect({mensagem:  "Erro ao buscar aulas"});
    });
});
   
