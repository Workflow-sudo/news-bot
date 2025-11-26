import fetch from "node-fetch";

const KEY = process.env.SUMMARIZER_API_KEY;

export default async function summarize(text) {
  if (!text) return "No text available.";

  try {
    const res = await fetch("https://api.apyhub.com/ai/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apy-token": KEY
      },
      body: JSON.stringify({ text })
    });
    const j = await res.json();
    return j.data || "Summary unavailable.";
  } catch {
    return "Summarizer API failed.";
  }
}
