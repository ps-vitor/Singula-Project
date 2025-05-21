// ./server/src/main.ts

import { Application } from "https://deno.land/x/oak/mod.ts";
import aulasRouter from "./routes/aulas.ts";
import  {errorHandler}  from  "./middleware/errorHandler.ts";
import { requestLogger } from "./middleware/logger.ts";
import { oakCors } from "../deps.ts";

const app = new Application();

app.use(errorHandler);
app.use(requestLogger);

app.use(oakCors({
  origin:"*",
  methods:["GET","POST","PUT","DELETE"],
  allowedHeaders:["Content-Type","Authorization"],
}));

// Middlewares globais (se necessário)
app.use(async (ctx, next) => {
  console.log(
    `[${new Date().toISOString()}] ${ctx.request.method} ${ctx.request.url.pathname}`
  );
  await next();
});

app.use(async(ctx,next)=>{
  if(ctx.request.url.pathname==="/"){
    ctx.response.status=200;
    ctx.response.body={
      message:"API Singula - Servidor Funcionando",
      version:"1.0.0",
      endpoints:["/aulas"]
    };
    return;
  }
  await next();
});

// Registre suas rotas ANTES do middleware 404
app.use(aulasRouter.routes());
app.use(aulasRouter.allowedMethods());

// Middleware 404 (DEVE vir depois das rotas)
app.use((ctx) => {
  ctx.response.status = 404;
  ctx.response.body = { 
    error: "Rota não encontrada",
    path:ctx.request.url.pathname,
    method:ctx.request.method,
  };
});

await app.listen({ port: 8000 });