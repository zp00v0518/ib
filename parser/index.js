const puppeteer = require("puppeteer");
const parseOneItem = require("./parseOneItem");
const saveResultToDB = require("./saveResultToDB");
const list = require("./list").flat(Infinity);
// list.length = 20;

const browserConfig = {
  defaultViewport: null,
  // args: ["--window-size=1920,1070"], // размер имеет значение
  // devtools: true,
  // headless: false,
  // args: [
  //   "--window-size=1920,1070",
  //   "--window-position=-310,-1080",
  //   '--log-level="1"',
  // ],
};
const stosks = new Set(list);

async function parse() {
  const browser = await puppeteer.launch(browserConfig);
  const result = [];
  let count = 0;
  console.time("start");
  for (const value of stosks) {
    console.log(`${count}:  ${value}`);
    const page = await browser.newPage();
    const data = await parseOneItem(page, value);
    result.push(data);
    ++count;
  }
  console.timeEnd("start");
  await saveResultToDB(result);
  // 2075887433
}
parse();
