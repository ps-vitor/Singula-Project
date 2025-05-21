import { Application,Router } from "../deps.ts";
import { join } from "https://deno.land/std/path/mod.ts";
import aulasRouter from "./routes/aulas.ts";
import { errorHandler } from "./middleware/errorHandler.ts";
import { requestLogger } from "./middleware/logger.ts";
import { oakCors } from "../deps.ts";

const app = new Application();
const __dirname = new URL('.', import.meta.url).pathname;

// Configurações iniciais existentes
app.use(errorHandler);
app.use(requestLogger);

app.use(oakCors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Middleware para servir arquivos estáticos do React
app.use(async (ctx, next) => {
  try {
    // Caminho para a pasta build do React (ajuste conforme sua estrutura)
    const buildPath = join(Deno.cwd(), "../client/build");
    
    // Se for uma rota da API, passa para o próximo middleware
    if (ctx.request.url.pathname.startsWith("/api")) {
      await next();
      return;
    }

    // Tenta servir o arquivo estático
    const filePath = ctx.request.url.pathname === "/"
      ? join(buildPath, "index.html")
      : join(buildPath, ctx.request.url.pathname);
    
    const file = await Deno.readFile(filePath);
    
    // Define Content-Type apropriado
    let contentType = "text/html";
    if (filePath.endsWith(".js")) contentType = "application/javascript";
    if (filePath.endsWith(".css")) contentType = "text/css";
    if (filePath.endsWith(".json")) contentType = "application/json";
    if (filePath.endsWith(".png")) contentType = "image/png";
    if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) contentType = "image/jpeg";

    ctx.response.headers.set("Content-Type", contentType);
    ctx.response.body = file;
  } catch (err:unknown) {
    console.log(`erro: ${err}`);
    if (!ctx.request.url.pathname.startsWith("/api")) {
      const indexHtml = await Deno.readFile(join(Deno.cwd(), "../client/build", "index.html"));
      ctx.response.headers.set("Content-Type", "text/html");
      ctx.response.body = indexHtml;
    } else {
      await next();
    }
  }
});

// Middlewares globais existentes
app.use(async (ctx, next) => {
  console.log(
    `[${new Date().toISOString()}] ${ctx.request.method} ${ctx.request.url.pathname}`
  );
  await next();
});

app.use(async (ctx, next) => {
  if (ctx.request.url.pathname === "/") {
    ctx.response.status = 200;
    ctx.response.body = {
      message: "API Singula - Servidor Funcionando",
      version: "1.0.0",
      endpoints: ["/api/aulas"] // Atualizado para /api/aulas
    };
    return;
  }
  await next();
});

// Prefixo para rotas da API
const apiRouter = new Router({prefix:"/api"});
apiRouter.use("/aulas", aulasRouter.routes(), aulasRouter.allowedMethods());

// Middleware 404 (mantido para rotas da API)
app.use((ctx) => {
  if (ctx.request.url.pathname.startsWith("/api")) {
    ctx.response.status = 404;
    ctx.response.body = { 
      error: "Rota da API não encontrada",
      path: ctx.request.url.pathname,
      method: ctx.request.method,
    };
  }
  // Para rotas não-API, o React Router cuidará do 404
});

app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());

await app.listen({ port: 8000 });