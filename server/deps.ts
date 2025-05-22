// ./server/deps.ts

// 1. Frameworks Web
export { Application, Router, Context } from "https://deno.land/x/oak/mod.ts";

export  type  {RouterContext} from  "https://deno.land/x/oak@v11.0.0/mod.ts";

// 2. Cheerio - USANDO A FORMA CORRETA
export { default as cheerio } from "https://esm.sh/cheerio@1.0.0-rc.12?pin=v135";
export  type  {Element} from  "https://esm.sh/cheerio@1.0.0-rc.12?pin=v135";

// 3. CORS 
export { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

// 4. Environment
export { load as dotenv } from "https://deno.land/std@0.204.0/dotenv/mod.ts";

// 5. Test Utilities
export {
  assert,
  assertEquals,
  assertRejects,
  assertStrictEquals
} from "https://deno.land/std@0.204.0/assert/mod.ts";

// 6. Mock Fetch
export const mockFetch = <T>(responses: Record<string, T>) => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input: RequestInfo | URL) => {
    const url = input.toString();
    return url in responses 
      ? new Response(JSON.stringify(responses[url]), { 
          headers: {"Content-Type": "application/json"} 
        })
      : originalFetch(input);
  };
  return () => { globalThis.fetch = originalFetch; };
};