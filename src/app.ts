import express from 'express';
import puppeteer from "puppeteer";

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send("hello")
})

app.post("/translate", async (req, res) => {
  let {
    body: { context },
  } = req;

  const browser = await puppeteer.launch({
    ignoreDefaultArgs: ["--enable-automation"],
  });
  const page = await browser.newPage();

  context = await translate("https://translate.google.cn/?sl=zh-CN&tl=en");
  context = await translate("https://translate.google.cn/?sl=en&tl=fr");
  context = await translate("https://translate.google.cn/?sl=fr&tl=ru");
  context = await translate("https://translate.google.cn/?sl=ru&tl=zh-CN");

  res.setHeader("Access-Control-Allow-Origin", "https://bunga.vercel.app")
  res.send(JSON.stringify(context, null, 2))

  async function translate(url: string) {
    await page.goto(url);
    await page.click(`textarea[aria-label="原文"]`, { clickCount: 3 });
    await page.type(`textarea[aria-label="原文"]`, context);
    await page.waitForSelector(`[jsname="W297wb"`, { timeout: 5000 });
    return await page.$eval(`[jsname="W297wb"`, (el) => el.innerHTML);
  }
});

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`)
})