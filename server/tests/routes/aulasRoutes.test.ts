// ./server/tests/routes/aulasRoutes.test.ts
import { Application, mockFetch, assertEquals } from "../../deps.ts";
import { scrapeChannelVideos } from "../../dist/services/scraperService.js";
import aulasRouter from "../../src/routes/aulas.ts";

// Dados mockados
const mockAulas = [{
  videoId: "123",
  titulo: "Aula teste",
  descricao: "",
  videoUrl: "",
  imgUrl: ""
}];

Deno.test("GET /aulas deve retornar 200 e dados corretos", async () => {
  // let listener: Deno.Listener | undefined = undefined;

  const restoreFetch = mockFetch({
    "https://www.youtube.com/channel/videos": {
      html: "<html>...mock do HTML do YouTube...</html>"
    },
    "https://www.youtube.com/watch?v=123": {
      html: "<html>...mock do vídeo específico...</html>"
    }
  });

  const mockScraper={
    scrapeChannelVideos:()=>Promise.resolve(mockAulas)
  };
  
  const importMap=new Map();
  importMap.set("../../src/services/scraperService.ts",mockScraper);
  const originalImport = Reflect.get(globalThis,"import");
  Reflect.set(globalThis,"import",(path:string)=>{
    return  importMap.get(path)??originalImport(path);
  });

  try {
    // 2. Configuração do servidor de teste
    const app = new Application();
    app.use(aulasRouter.routes());

    const server=await  app.listen({port:8000});
    const listener = server.listener;
    
    try{
      const response = await fetch("http://localhost:8000/aulas");
      assertEquals(response.status,200);
      
      const body = await response.json();
      assertEquals(Array.isArray(body), true);
      assertEquals(body.length, mockAulas.length);
      assertEquals(body[0].videoId, mockAulas[0].videoId);
    }finally{
      listener.close();
    }
  } finally {
    Reflect.set(globalThis,"import",originalImport);
    restoreFetch();
  }
});