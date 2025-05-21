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

  globalThis.fetch = async () => new Response(`
    <html>
      <div id="contents">
        <ytd-rich-item-renderer>
          <a href="/watch?v=123">Video 1</a>
          <img src="thumbnail1.jpg">
          <h3>Título do Vídeo 1</h3>
        </ytd-rich-item-renderer>
      </div>
    </html>
  `, { status: 200 });

  try{
    const videos = await scrapeChannelVideos("https://youtube.com/@Pr.Singula");
    assert(Array.isArray(videos),"Deveria retornar um array");
    assert(videos.length > 0,"Deveria retornar pelo menos um video");
    assert(videos[0].videoId,"Deveria conter videoID");
    assert(videos[0].titulo,"Deveria conter titulo");
  }finally{
    globalThis.fetch = originalFetch;
  }
});