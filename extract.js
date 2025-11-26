import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

const MAX_CHARS = 7000;

export async function extract(url) {
  try {
    const res = await fetch(url, { headers: { "User-Agent": process.env.USER_AGENT }, redirect: "follow", timeout: 15000 });
    if (!res.ok) {
      console.warn("extract fetch failed", res.status, url);
      return "";
    }
    const html = await res.text();
    const dom = new JSDOM(html, { url });
    const article = new Readability(dom.window.document).parse();
    const text = article?.textContent?.trim() ?? "";
    return text.slice(0, MAX_CHARS);
  } catch (e) {
    console.warn("extract error", e.message || e);
    return "";
  }
}
