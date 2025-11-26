export default function buildNewsletter(articles) {
  return articles
    .map(
      (a, i) => `## ${i + 1}. ${a.title}

${a.summary}

👉 Read more: ${a.link}

---`
    )
    .join("\n\n");
}
