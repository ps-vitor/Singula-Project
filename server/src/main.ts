// ./server/src/main.ts
// ./server/src/main.ts
import { Application, Router } from "../deps.ts";
import { join, dirname, fromFileUrl } from "https://deno.land/std/path/mod.ts";
import aulasRouter from "./routes/aulas.ts";
import { errorHandler } from "./middleware/errorHandler.ts";
import { requestLogger } from "./middleware/logger.ts";
import { oakCors } from "../deps.ts";
import { staticFileContentTypes } from '../../shared/types.ts';

const clientDistPath = join(
  dirname(fromFileUrl(import.meta.url)),
  "../../client/dist"
);

const app = new Application();

// Middlewares globais
app.use(errorHandler);
app.use(requestLogger);
app.use(oakCors({
  origin: [
    "http://localhost:5173",
    "http://localhost:8000",
    /^http?:\/\/localhost(:\d+)?$/
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Rota raiz da API
app.use(async (ctx, next) => {
  if (ctx.request.url.pathname === "/") {
    ctx.response.status = 200;
    ctx.response.body = {
      message: "API Singula - Servidor Funcionando",
      version: "1.0.0",
      endpoints: ["/aulas"]
    };
    return;
  }
  await next();
});

// Configuração das rotas
const apiRouter = new Router();
apiRouter.get("/api/ping", (ctx) => {
  ctx.response.body = { status: "ok", timestamp: new Date().toISOString() };
});

// Registrar rotas de API antes do middleware estático
app.use(aulasRouter.routes());
app.use(aulasRouter.allowedMethods());
app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());

function getContentType(filePath: string): string {
  const extension = filePath.split('.').pop()?.toLowerCase() || '';
  return staticFileContentTypes[extension] || 'application/octet-stream';
}

// Middleware para arquivos estáticos (ATUALIZADO)
app.use(async (ctx, next) => {
  // Ignorar completamente rotas da API e aulas
  if (ctx.request.url.pathname.startsWith("/api") || 
      ctx.request.url.pathname.startsWith("/aulas")) {
    return await next();
  }

  try {
    let filePath = ctx.request.url.pathname;
    if (filePath === "/") filePath = "/index.html";
    
    const fullPath = join(clientDistPath, filePath);
    const file = await Deno.readFile(fullPath);
    ctx.response.type = getContentType(fullPath);
    ctx.response.body = file;
  } catch (err) {
    console.log(`Erro ao servir arquivo estático: ${err}`);
    // Somente fallback para index.html em rotas não-API
    const indexHtml = await Deno.readFile(join(clientDistPath, "index.html"));
    ctx.response.type = "text/html";
    ctx.response.body = indexHtml;
  }
});

// Middleware 404 (ATUALIZADO)
app.use((ctx) => {
  if (ctx.request.url.pathname.startsWith("/api") || 
      ctx.request.url.pathname.startsWith("/aulas")) {
    ctx.response.status = 404;
    ctx.response.body = { 
      error: "Rota da API não encontrada",
      path: ctx.request.url.pathname,
      method: ctx.request.method,
      availableEndpoints: ["/aulas", "/api/ping"]
    };
  } else {
    // Para rotas não-API, já foi tratado pelo middleware estático
    ctx.response.status = 404;
    ctx.response.body = "Página não encontrada";
  }
});

await app.listen({ port: 8000 });