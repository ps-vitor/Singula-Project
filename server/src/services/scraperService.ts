// ./server/src/services/scraperService.ts

import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

export const scraperChannelVideos = async () => {
  const res = await fetch("https://www.youtube.com/@PrSingula/videos");
  const html = await res.text();
  const doc = new DOMParser().parseFromString(html, "text/html");

  if (!doc) {
    throw new Error("Erro ao processar o HTML.");
  }

  const videoElements = doc.querySelectorAll('a[href*="/watch?v="]');
  const videos: string[] = [];

  videoElements.forEach((el) => {
    const href = el.getAttribute("href");
    if (href && !videos.includes(href)) {
      videos.push(href);
    }
  });

  return videos;
};
