// ./server/deps.ts
export { Application, Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
export { oakCors as cors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
export { load as dotenv } from "https://deno.land/std@0.204.0/dotenv/mod.ts";
export * as log from "https://deno.land/std@0.204.0/log/mod.ts";
export { load as cheerio } from "https://deno.land/x/cheerio@1.0.7/mod.ts";