// ./server/tests/services/scraperService.test.ts
import { assertRejects, assert } from "../../deps.ts";

Deno.test("scrapeChannelVideos deve rejeitar com URL inválida", async () => {
  const { scrapeChannelVideos } = await import("../../src/services/scraperService.ts");
  await assertRejects(
    () => scrapeChannelVideos("url-invalida"),
    Error,
    "URL_INVALIDA"
  );
});

Deno.test("scrapeChannelVideos deve retornar array de vídeos", async () => {
  // Mock da função httpClient
  const mockHttpClient = async (url: string): Promise<string> => {
    if (url.includes("@Pr.Singula/videos") || (url.includes("youtube.com") && url.includes("videos"))) {
      // HTML da página do canal com links para vídeos
      return `
        <html>
          <body>
            <a href="/watch?v=abc123def456ghi">Título do Vídeo 1</a>
            <a href="/watch?v=xyz789uvw123rst">Título do Vídeo 2</a>
            <div>
              <a href="/watch?v=mno456pqr789stu">Outro link</a>
            </div>
          </body>
        </html>
      `;
    }
    
    if (url.includes("youtube.com/watch")) {
      // HTML da página individual do vídeo com metadados
      return `
        <html>
          <head>
            <meta name="title" content="Título do Vídeo Teste" />
            <meta name="description" content="Descrição do vídeo de teste" />
          </head>
        </html>
      `;
    }

    throw new Error("URL não encontrada");
  };

  const { scrapeChannelVideos } = await import("../../src/services/scraperService.ts");
  
  // Corrigido: passando maxVideos como segundo argumento e mockHttpClient como terceiro
  const videos = await scrapeChannelVideos(
    "https://www.youtube.com/@Pr.Singula/videos", 
    20, // maxVideos
    mockHttpClient // httpClient
  );
  
  assert(Array.isArray(videos), "Deveria retornar um array");
  assert(videos.length > 0, "Deveria retornar pelo menos um vídeo");
  
  if (videos.length > 0) {
    assert(videos[0].videoId, "Deveria conter videoId");
    assert(videos[0].titulo, "Deveria conter título");
    assert(videos[0].videoUrl, "Deveria conter videoUrl");
    assert(videos[0].imgUrl, "Deveria conter imgUrl");
    
    // Verificar formato correto das URLs
    assert(videos[0].videoUrl.includes("youtube.com/watch"), "videoUrl deve ser watch URL");
    assert(videos[0].imgUrl.includes("img.youtube.com"), "imgUrl deve ser URL de thumbnail");
    
    // Verificar se o videoId tem o tamanho correto (11 caracteres)
    assert(videos[0].videoId.length === 11, "videoId deve ter 11 caracteres");
  }
});