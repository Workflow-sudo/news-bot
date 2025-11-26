import axios from "axios";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

export default async function extract(url) {
  try {
    const html = (await axios.get(url)).data;
    const dom = new JSDOM(html, { url });
    const article = new Readability(dom.window.document).parse();
    return article?.textContent || "";
  } catch {
    return "";
  }
}
