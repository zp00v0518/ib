// https://www.macrotrends.net/assets/php/stock_data_download.php?s=60b32ae20ac4c&t=CTRM
// https://www.macrotrends.net/assets/php/stock_price_history.php?t=AAPL
const puppeteer = require('puppeteer')
const browserConfig = require('../browserConfig')
const parseOneItem = require('./parseOneItem')
const saveDataToDB = require('./saveDataToDB')
const splitArrOnSmallArr = require('../splitArrOnSmallArr')
const config = require('../../config')
let list = require('./symbol_list.json')

list = list.map((i) => {
  let name = i.s.split('/')[0]
  return name.replace('.', '_')
})
const stosks = new Set(list)
const matrix = splitArrOnSmallArr(Array.from(stosks), 3)
const indexStopLastParse = 1872;
matrix.splice(0, indexStopLastParse-1)

// 997: CO,BOWX,CAPL
// 996:IDT, ATHA, CLAR

async function parse() {
  const browser = await puppeteer.launch(browserConfig)
  let count = indexStopLastParse
  for (const arr of matrix) {
    console.time('start')
    let result = []
    console.log(`${count}:  ${arr}`)
    const promises = arr.map(async (symbol) => {
      const data = await parseOneItem(browser, symbol)
      if (data) {
        return { symbol, data }
      }
      return data
    })
    const f = await Promise.all(promises)
    result = f.filter((i) => !!i)
    ++count
    const collectionName = config.db.collections.splitMacroTrend.name
    await saveDataToDB(result, collectionName)
    console.timeEnd('start')
  }
  await browser.close()
  return
}

parse()
