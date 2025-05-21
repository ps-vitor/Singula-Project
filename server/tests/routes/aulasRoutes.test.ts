// ./server/tests/routes/aulasRoutes.test.ts
import { Application, mockFetch, assertEquals} from "../../deps.ts";
import aulasRouter from "../../src/routes/aulas.ts";
import { Context } from "https://deno.land/x/oak/mod.ts";

Deno.test("GET /aulas deve retornar 200 e dados corretos", async () => {
  // Mock do HTML da página do canal com vídeos
  const channelHTML = `
    <html>
      <body>
        <a href="/watch?v=123">Vídeo 1</a>
        <a href="/watch?v=456">Vídeo 2</a>
      </body>
    </html>
  `;

  // Mock do HTML da página individual do vídeo
  const videoHTML = `
    <html>
      <head>
        <meta name="title" content="Aula teste" />
        <meta name="description" content="Descrição mock" />
      </head>
    </html>
  `;

  const restoreFetch = mockFetch({
    "https://www.youtube.com/@Pr.Singula/videos": channelHTML,
    "https://www.youtube.com/watch?v=123": videoHTML,
    "https://www.youtube.com/watch?v=456": videoHTML
  });

  const app = new Application();
  app.use(aulasRouter.routes());
  app.use(aulasRouter.allowedMethods());

  // Middleware 404
  app.use((ctx: Context) => {
    ctx.response.status = 404;
    ctx.response.body = { error: "Rota não encontrada" };
  });

  const controller = new AbortController();
  // const { signal } = controller;
  
  // const listener = app.listen({ port: 0, signal });
  
  await new Promise(resolve => setTimeout(resolve, 100));

  try {
    const mockContext = {
      response: {
        status: undefined,
        body: undefined,
      },
      request: {
        method: "GET",
        url: new URL("http://localhost/aulas")
      }
    } as unknown as Context;

    // Importar e chamar diretamente a função do controlador
    const { listarAulas } = await import("../../src/controllers/aulasController.ts");
    await listarAulas(mockContext);

    // Verificar se o status é 200
    assertEquals(mockContext.response.status, 200);
    
    // Verificar se retorna um array
    const body = mockContext.response.body;
    if(!body||typeof  body!=='object'){
      throw new Error('Resposta inválida: body não é um objeto');
    }
    const responseBody=body as{
      success:boolean;
      total:number;
      data:unknown;
    }

    assertEquals(responseBody.success, true);
    assertEquals(typeof responseBody.total,'number');
    assertEquals(Array.isArray(responseBody.data), true);
    
  } finally {
    controller.abort();
    restoreFetch();
  }
});