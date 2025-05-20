// ./server/tests/scraperService.test.ts
import { assertRejects, assert } from "https://deno.land/std@0.204.0/assert/mod.ts";
import { scrapeChannelVideos } from "../../src/services/scraperService.ts";

Deno.test("scrapeChannelVideos deve rejeitar com URL inválida", async () => {
  await assertRejects(
    () => scrapeChannelVideos("url-invalida"),
    Error,
    "URL_INVALIDA"
  );
});

Deno.test("scrapeChannelVideos deve retornar array de vídeos", async () => {
  // Mock do fetch global
  const originalFetch = globalThis.fetch;
  globalThis.fetch = () => Promise.resolve(new Response(
    `<html><a href="/watch?v=123">Video 1</a></html>`,
    { status: 200 }
  ));

  const videos = await scrapeChannelVideos("https://youtube.com");
  assert(Array.isArray(videos));
  assert(videos.length > 0);

  // Restaura o fetch original
  globalThis.fetch = originalFetch;
});