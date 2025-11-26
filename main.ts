import { scrape } from "./scrape.ts";
import { extract } from "./extract.ts";
import { summarize } from "./summarize.ts";
import buildNewsletter from "./newsletter.ts";

const WEBHOOK = Deno.env.get("N8N_WEBHOOK_URL") || "";

async function handleRun(req: Request) {
  try {
    const url = new URL(req.url);
    const topic = url.searchParams.get("topic") ?? "world news";
    console.log("RUN START", topic);

    const articles = await scrape(topic);
    const chosen = articles.slice(0, Number(Deno.env.get("MAX_ARTICLES") || 5));

    const results: Array<{ title: string; link: string; summary: string }> = [];

    for (const a of chosen) {
      console.log("Extracting:", a.title);
      const text = await extract(a.link);
      const summary = text ? await summarize(text) : "No article text";
      results.push({ title: a.title, link: a.link, summary });
      // small pause so target servers don't freak out
      await new Promise((r) => setTimeout(r, 300 + Math.random() * 700));
    }

    const newsletter = buildNewsletter(results);

    if (!WEBHOOK) {
      console.warn("No N8N_WEBHOOK_URL set — skipping webhook POST.");
    } else {
      await fetch(WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articles: results, newsletter }),
      });
    }

    return new Response("done", { status: 200 });
  } catch (e) {
    console.error("RUN ERROR", e);
    return new Response("error", { status: 500 });
  }
}

Deno.serve(async (req) => {
  const u = new URL(req.url);
  if (u.pathname === "/run") return handleRun(req);
  return new Response("ok", { status: 200 });
});
