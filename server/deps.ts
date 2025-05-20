// ./server/deps.ts
// Correção: Removendo async desnecessário na função de mock
export { Application, Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
export { oakCors as cors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
export { load as dotenv } from "https://deno.land/std@0.204.0/dotenv/mod.ts";
export { load as cheerio } from "https://esm.sh/cheerio@1.0.0-rc.12";
export * as log from "https://deno.land/std@0.204.0/log/mod.ts";

export {
  assert,
  assertEquals,
  assertExists,
  assertRejects,
  assertStrictEquals,
  assertThrows,
  unimplemented,
  unreachable
} from "https://deno.land/std@0.204.0/assert/mod.ts";

// Correção: Removendo async desnecessário
export const mockFetch = (responses: Record<string, unknown>) => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input: RequestInfo | URL) => {
    const url = input.toString();
    if (url in responses) {
      return new Response(JSON.stringify(responses[url]), {
        headers: { "Content-Type": "application/json" }
      });
    }
    return originalFetch(input);
  };
  return () => { globalThis.fetch = originalFetch; };
};