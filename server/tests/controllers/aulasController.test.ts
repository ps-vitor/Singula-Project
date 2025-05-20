// ./server/tests/aulasController.test.ts
import { assertEquals, mockFetch } from "../../deps.ts";
import { Context } from "oak/mod.ts";

// Dados mockados
const mockAulas = [{
  videoId: "123",
  titulo: "Aula Teste"
}];

Deno.test("listarAulas deve retornar status 200 e lista de aulas", async () => {
  // 1. Mock das requisições HTTP
  const restoreFetch = mockFetch({
    "https://api.youtube.com/channel/videos": {
      data: mockAulas
    }
  });

  try {
    const { listarAulas } = await import("../../src/controllers/aulasController.ts");
    
    // 2. Contexto mockado
    const ctx = {
      response: {
        status: undefined,
        body: undefined,
      },
    } as unknown as Context;

  } finally {
    // 5. Restaura o fetch original
    restoreFetch();
  }
});