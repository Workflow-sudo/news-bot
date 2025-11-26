export default function buildNewsletter(articles) {
  if (!articles || articles.length === 0) return "No articles found.";

  return articles
    .map((a, i) => `## ${i + 1}. ${a.title}\n\n${a.summary}\n\nRead more: ${a.link}\n\nSource: ${a.source || "unknown"}\n---`)
    .join("\n\n");
}
