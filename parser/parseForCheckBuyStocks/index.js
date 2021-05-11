const fs = require('fs')
const puppeteer = require('puppeteer')
const browserConfig = require('../browserConfig')
const parseOneItem = require('./parseOneItem')
const saveResultToDB = require('../saveResultToDB')
const splitArrOnSmallArr = require('../splitArrOnSmallArr')
const list = require('../list').flat(Infinity)
const config = require('../../config')

const stosks = new Set(list)
const matrix = splitArrOnSmallArr(Array.from(stosks), 3)

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
  // for (const value of stosks) {
  //   console.log(`${count}:  ${value}`)
  //   const page = await browser.newPage()
  //   const data = await parseOneItem(page, value)
  //   result.push(data)
  //   ++count
  // }
  console.timeEnd('start')
  const collectionName = config.db.collections.checkToBuy.name
  result = result.filter((item) => {
    const data = item.data[0]
    if (!data || !data.indicators || !data.indicators.quote || !data.indicators.quote[0]) return false;
    const check = checkToBuy(data.indicators.quote[0].open)
    return check
  });
  const symbolsList = result.map(i => i.symbol);
  fs.writeFileSync('./parseResult.json', JSON.stringify(symbolsList));
  await saveResultToDB(result, collectionName)
}
parse()

function checkToBuy(values) {
  const price = values[values.length - 1]
  if (price > 90) return false;
  const min = Math.min(...values)
  const max = Math.max(...values)
  if (min / price > 0.8) return false
  if (max / price < 1.3) return false
  return true
}