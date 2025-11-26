import scrape from "./scrape.js";
import extract from "./extract.js";
import summarize from "./summarize.js";
import buildNewsletter from "./newsletter.js";
import fetch from "node-fetch";

const WEBHOOK = process.env.N8N_WEBHOOK_URL;
const MAX = Number(process.env.MAX_ARTICLES || 5);

async function run() {
  console.log("RUN START");
  const articles = await scrape();
  const chosen = articles.slice(0, MAX);

  const results = [];
  for (const a of chosen) {
    console.log("Extracting:", a.title);
    const text = await extract(a.link);
    const summary = await summarize(text);
    results.push({ title: a.title, link: a.link, summary });
  }

  const newsletter = buildNewsletter(results);

  await fetch(WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ articles: results, newsletter })
  });

  console.log("SENT TO N8N");
}

run();
