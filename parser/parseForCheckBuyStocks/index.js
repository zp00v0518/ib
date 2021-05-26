const fs = require('fs')
const puppeteer = require('puppeteer')
const browserConfig = require('../browserConfig')
const parseOneItem = require('./parseOneItem')
const checkToBuy = require('./checkToBuy')
const saveResultToDB = require('../saveResultToDB')
const splitArrOnSmallArr = require('../splitArrOnSmallArr')
const list = require('../list').flat(Infinity)
const config = require('../../config')
// list.length = 9;

const stosks = new Set(list)
const matrix = splitArrOnSmallArr(Array.from(stosks), 3)
// matrix.length = 650

async function parse() {
  const browser = await puppeteer.launch(browserConfig)
  let result = []
  let count = 0
  console.time('start')
  for (const arr of matrix) {
    console.log(`${count}:  ${arr}`)
    const promises = arr.map(async (symbol) => {
      const page = await browser.newPage()
      const data = await parseOneItem(page, symbol)
      return data
    })
    const f = await Promise.all(promises)
    result.push(...f)
    ++count
  }
  console.timeEnd('start')
  const collectionName = config.db.collections.checkToBuy.name
  result = result.filter((item) => {
    const data = item.data[0]
    if (!data || !data.indicators || !data.indicators.quote || !data.indicators.quote[0]) return false;
    const check = checkToBuy(data.indicators.quote[0].close)
    // const check = checkToBuy(data.indicators.quote[0].open)
    return check
  });
  const symbolsList = result.map(i => i.symbol);
  fs.writeFileSync('./parser/parseForCheckBuyStocks/parseResult.json', JSON.stringify(symbolsList));
  await saveResultToDB(result, collectionName)
}
parse()

// function checkToBuy(values) {
//   if (!values) return false;
//   const price = values[values.length - 1]
//   if (!price || price > 90) return false;
//   const min = Math.min(...values)
//   if(!min || min < 0.01) return false;
//   const max = Math.max(...values)
//   if (min / price > 0.8) return false
//   if (max / price < 1.3) return false
//   return true
// }
