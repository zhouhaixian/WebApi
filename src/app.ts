import express from "express";
import bodyParser from "body-parser";

import index from "./index";
import translate from "./translate";

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.all("*", (_, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    process.env.NODE_ENV === "dev" ? "*" : "https://bunga.vercel.app"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/", index);

app.post("/translate", translate);

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});
