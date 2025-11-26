import fetch from "node-fetch";
import { parseRss } from "./rss.js";
import { extract } from "./extract.js";
import summarize from "./summarize.js";
import buildNewsletter from "./newsletter.js";

const WEBHOOK = process.env.N8N_WEBHOOK_URL;
const MAX = Number(process.env.MAX_ARTICLES || 6);

export default async function run({ topic } = {}) {
  console.log("RUN START", topic);
  const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(topic)}&hl=en-US&gl=US&ceid=US:en`;

  const items = await parseRss(rssUrl);
  const chosen = items.slice(0, MAX);

  const results = [];
  for (const it of chosen) {
    try {
      console.log("Processing:", it.title);
      const text = await extract(it.link);
      const summary = text ? await summarize(text) : "No article body extracted.";
      results.push({ title: it.title, link: it.link, source: it.source, pubDate: it.pubDate, summary });
      // polite delay
      await new Promise((r) => setTimeout(r, 500 + Math.random() * 500));
    } catch (e) {
      console.error("Item error", it.link, e);
    }
  }

  const newsletter = buildNewsletter(results);

  if (WEBHOOK) {
    await fetch(WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articles: results, newsletter, generatedAt: new Date().toISOString() })
    });
    console.log("Sent to n8n");
  } else {
    console.warn("N8N_WEBHOOK_URL not set; skipping POST");
  }

  console.log("RUN END");
  return { articles: results, newsletter };
}
