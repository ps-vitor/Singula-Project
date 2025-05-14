// ./server/src/middleware/logger.ts

import * as log from "https://deno.land/std@0.204.0/log/mod.ts";

export async function requestLogger(ctx: any, next: any) {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  log.info(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
}

export const logger = log;
