import { chromium } from "playwright";

export default async function scrape() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("https://news.google.com/search?q=world+news", {
    waitUntil: "domcontentloaded"
  });

  const results = await page.$$eval("article", (nodes) =>
    nodes.map((a) => {
      const title = a.querySelector("h3, h4")?.innerText || null;
      let link = a.querySelector("a")?.href || null;
      if (link?.startsWith("./")) link = "https://news.google.com" + link.slice(1);
      return { title, link };
    })
  );

  await browser.close();
  return results.filter((x) => x.title && x.link);
}
