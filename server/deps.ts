// ./server/deps.ts

// 1. Frameworks Web
export { Application, Router, Context } from "https://deno.land/x/oak/mod.ts";
export  type { RouterContext } from "https://deno.land/x/oak/mod.ts";

export { default as cheerio } from "https://esm.sh/cheerio@1.0.0-rc.12?pin=v135";
export  type  {Element} from  "https://esm.sh/cheerio@1.0.0-rc.12?pin=v135";

export { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

export { load as dotenv } from "https://deno.land/std@0.204.0/dotenv/mod.ts";

export {
  assert,
  assertEquals,
  assertRejects,
  assertStrictEquals
} from "https://deno.land/std@0.204.0/assert/mod.ts";

// Mock Fetch
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