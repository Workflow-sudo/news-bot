import express from "express";
import run from "./index.js"; // your main logic

const app = express();

app.get("/run", async (req, res) => {
  try {
    await run(); // call your scraper
    res.send("done");
  } catch (e) {
    console.error(e);
    res.status(500).send("error");
  }
});

app.listen(10000, () => {
  console.log("Server running on port 10000");
});
