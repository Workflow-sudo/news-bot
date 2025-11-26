import express from "express";
import run from "./run.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => res.send("AI News Bot OK"));
app.get("/run", async (req, res) => {
  try {
    // optional topic via ?topic=...
    const topic = req.query.topic || "artificial intelligence OR ai agents OR automation";
    await run({ topic });
    res.send("done");
  } catch (err) {
    console.error("Run error:", err);
    res.status(500).send("error");
  }
});

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
