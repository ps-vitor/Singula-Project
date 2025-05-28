import { Application, Router } from "../deps.ts";
import { join, dirname, fromFileUrl } from "https://deno.land/std/path/mod.ts";
import aulasRouter from "./routes/aulas.ts";
import { errorHandler } from "./middleware/errorHandler.ts";
import { requestLogger } from "./middleware/logger.ts";
import { oakCors } from "../deps.ts";
import { staticFileContentTypes } from '../../shared/types.ts';
import videoRoutes from "./videos.ts";

const clientDistPath = join(
  dirname(fromFileUrl(import.meta.url)),
  "../../client/dist"
);

const app = new Application();
const __dirname = new URL('.', import.meta.url).pathname;

// Configurações iniciais existentes
app.use(errorHandler);
app.use(requestLogger);

// Middlewares globais existentes
app.use(async (ctx, next) => {
  console.log(
    `[${new Date().toISOString()}] ${ctx.request.method} ${ctx.request.url.pathname}`
  );
  await next();
});

app.use(async (ctx, next) => {
  ctx.response.headers.set('Access-Control-Allow-Origin', ctx.request.headers.get('origin') || '*');
  ctx.response.headers.set('Access-Control-Allow-Credentials', 'true');
  ctx.response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  ctx.response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  await next();
});

// Rota raiz da API
app.use(async (ctx, next) => {
  if (ctx.request.url.pathname === "/") {
    ctx.response.status = 200;
    ctx.response.body = {
      message: "API Singula - Servidor Funcionando",
      version: "1.0.0",
      endpoints: [
        "/api/aulas"
      ],
    };
    return;
  }
  await next();
});

const apiRouter = new Router();
apiRouter.use("/api/aulas", aulasRouter.routes());
apiRouter.use("/aulas", aulasRouter.routes()); // duplicate route for backward compatibility

// Health check endpoint
apiRouter.get("/api/ping", (ctx) => {
  ctx.response.body = { status: "ok", timestamp: new Date().toISOString() };
});

app.use(oakCors({
  origin: [
    "http://localhost:5173",
    "http://localhost:8000",
    /^http?:\/\/localhost(:\d+)?$/
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  preflightContinue:false,
  optionsSuccessStatus:204
}));

app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());

function getContentType(filePath: string): string {
  const extension = filePath.split('.').pop()?.toLowerCase() || '';
  return staticFileContentTypes[extension] || 'application/octet-stream';
}

// Middleware para servir arquivos estáticos do React - MOVIDO PARA DEPOIS DAS ROTAS DA API
app.use(async (ctx, next) => {
  try {
    // Se for uma rota da API ou aulas, já foi processada acima
    if (ctx.request.url.pathname.startsWith("/api") || 
        ctx.request.url.pathname.startsWith("/aulas")) {
      await next();
      return;
    }

    let filePath = ctx.request.url.pathname;
    if (filePath === "/") filePath = "/index.html";
    
    const fullPath = join(clientDistPath, filePath);
    const file = await Deno.readFile(fullPath);
    ctx.response.type = getContentType(fullPath);
    ctx.response.body = file;
  } catch (err: unknown) {
    console.log(`erro: ${err}`);
    // Para qualquer rota que não seja da API e não encontre arquivo físico,
    // serve o index.html (SPA fallback)
    if (!ctx.request.url.pathname.startsWith("/api") && 
        !ctx.request.url.pathname.startsWith("/aulas")) {
      const indexHtml = await Deno.readFile(join(clientDistPath, "index.html"));
      ctx.response.type = "text/html";
      ctx.response.body = indexHtml;
    } else {
      await next();
    }
  }
});

// Middleware 404 final para rotas da API que não foram encontradas
app.use((ctx) => {
  if (ctx.request.url.pathname.startsWith("/api") || 
      ctx.request.url.pathname.startsWith("/aulas")) {
    ctx.response.status = 404;
    ctx.response.body = { 
      error: "Rota da API não encontrada",
      path: ctx.request.url.pathname,
      method: ctx.request.method,
      avaibleEndpoints:[
        "/api/aulas",
        "/aulas",
        "/api/ping",
      ],
    };
  }
});

app.use(videoRoutes.routes());
app.use(videoRoutes.allowedMethods());

await app.listen({ port: 8000 });