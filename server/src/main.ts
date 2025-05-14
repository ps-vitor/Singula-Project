// ./server/src/main.ts

import { Application } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import * as log from "https://deno.land/std@0.204.0/log/mod.ts";
import aulasRouter  from "./routes/aulas.ts"; // ← .ts normalizado
import { requestLogger } from "./middleware/logger.ts";

await log.setup({
    handlers: {
      console: new log.handlers.ConsoleHandler("DEBUG"),
    },
    loggers: {
      default: {
        level: "DEBUG",
        handlers: ["console"],
      },
    },
});

const app = new Application();

app.use(requestLogger);
app.use(aulasRouter.routes());

await app.listen({ port: 8000 });