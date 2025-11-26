import fetch from "node-fetch";

/**
 * parseRss(url) -> returns array of { title, link, pubDate, source }
 * lightweight XML parsing using DOMParser available via JSDOM or simple regex.
 * We'll do a DOM parse using DOMParser from jsdom by constructing a minimal HTML DOM.
 */

export async function parseRss(url) {
  const res = await fetch(url, { headers: { "User-Agent": process.env.USER_AGENT } });
  if (!res.ok) {
    console.warn("RSS fetch failed", res.status, url);
    return [];
  }
  const xml = await res.text();

  // Lightweight parsing without extra dependency: use DOMParser via JSDOM
  // But JSDOM is heavier — since it's installed we can use it.
  const { JSDOM } = await import("jsdom");
  const dom = new JSDOM(xml, { contentType: "text/xml" });
  const items = Array.from(dom.window.document.querySelectorAll("item")).map((it) => {
    return {
      title: it.querySelector("title")?.textContent?.trim() ?? "",
      link: it.querySelector("link")?.textContent?.trim() ?? "",
      pubDate: it.querySelector("pubDate")?.textContent ?? "",
      source: it.querySelector("source")?.textContent ?? ""
    };
  });
  return items;
}
