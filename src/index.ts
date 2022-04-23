import Koa from "koa";
import Router from "koa-router";
import bodyParser from "koa-bodyParser";
import puppeteer from "puppeteer";

const app = new Koa();
const router = new Router();

router.post("/translate", async (ctx) => {
  let {
    body: { context },
  } = ctx.request.body;

  const browser = await puppeteer.launch({
    ignoreDefaultArgs: ["--enable-automation"],
  });
  const page = await browser.newPage();

  context = await translate("https://translate.google.cn/?sl=zh-CN&tl=en");
  context = await translate("https://translate.google.cn/?sl=en&tl=fr");
  context = await translate("https://translate.google.cn/?sl=fr&tl=ru");
  context = await translate("https://translate.google.cn/?sl=ru&tl=zh-CN");

  ctx.body = JSON.stringify(context, null, 2);

  async function translate(url: string) {
    await page.goto(url);
    await page.click(`textarea[aria-label="原文"]`, { clickCount: 3 });
    await page.type(`textarea[aria-label="原文"]`, context);
    await page.waitForSelector(`[jsname="W297wb"`, { timeout: 5000 });
    return await page.$eval(`[jsname="W297wb"`, (el) => el.innerHTML);
  }
});

app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000, () => {
  console.log('listening on http://localhost:3000')
})