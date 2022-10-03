const puppeteer = require("puppeteer");
const parseOneItem = require("./parseOneItem");
const saveResultToDB = require("./saveResultToDB");
const browserConfig = require("./browserConfig");
const list = require("./list").flat(Infinity);
const config = require("../config");
// list.length = 20;

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
    if (data) {
      result.push(data);
    }
    ++count;
  }
  console.timeEnd("start");
  const collectionName = config.db.collections.dataUSA.name;
  await saveResultToDB(result, collectionName);
  // 2075887433
}
parse();
