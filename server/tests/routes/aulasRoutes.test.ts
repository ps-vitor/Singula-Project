// ./server/tests/routes/aulasRoutes.test.ts
import { Application, mockFetch, assertEquals } from "../../deps.ts";
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
  let listener: Deno.Listener | undefined = undefined;

  const restoreFetch = mockFetch({
    "https://www.youtube.com/channel/videos": {
      html: "<html>...mock do HTML do YouTube...</html>"
    },
    "https://www.youtube.com/watch?v=123": {
      html: "<html>...mock do vídeo específico...</html>"
    }
  });
  
  const originalScraper = await import("../../src/services/scraperService.ts");
  const originalFn = originalScraper.scrapeChannelVideos;
  originalScraper.scrapeChannelVideos = () => Promise.resolve(mockAulas);

  try {
    // 2. Configuração do servidor de teste
    const app = new Application();
    app.use(aulasRouter.routes());

    // CORREÇÃO: Deixar que o TypeScript infira o tipo ou usar uma conversão 
    // diferente para evitar o erro de tipo ao atribuir o listener
    // listener = await app.listen({ port: 8000 });
    // OU, se realmente precisar da conversão, faça isso:
    listener = await app.listen({ port: 8000 }) as unknown as Deno.Listener;
    
    const url = `http://localhost:8000/aulas`;

    // 3. Faz a requisição
    const response = await fetch(url);
    
    // 4. Verificações
    assertEquals(response.status, 200);
    
    const body = await response.json();
    assertEquals(Array.isArray(body), true);
    assertEquals(body.length, mockAulas.length);
    assertEquals(body[0].videoId, mockAulas[0].videoId);

  } finally {
    if (listener) {
      listener.close();
    }
    restoreFetch();
    originalScraper.scrapeChannelVideos = originalFn;
  }
});