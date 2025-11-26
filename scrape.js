import puppeteer from "puppeteer";

export default async function scrape() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();

  await page.goto(
    "https://news.google.com/search?q=world+news&hl=en-US&gl=US&ceid=US:en",
    { waitUntil: "domcontentloaded" }
  );

  const results = await page.$$eval("article", (nodes) =>
    nodes
      .map((a) => {
        const title = a.querySelector("h3, h4")?.innerText || null;
        let link = a.querySelector("a")?.href || null;

        if (link?.startsWith("./")) {
          link = "https://news.google.com" + link.slice(1);
        }

        return { title, link };
      })
      .filter((x) => x.title && x.link)
  );

  await browser.close();
  return results;
}
