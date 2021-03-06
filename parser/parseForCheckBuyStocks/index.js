const fs = require('fs')
const puppeteer = require('puppeteer')
const browserConfig = require('../browserConfig')
const parseOneItem = require('./parseOneItem')
// const checkToBuy = require('./checkToBuy')
const methods = require('../../backend/immitation/calculateImmitation/methods')
const saveResultToDB = require('../saveResultToDB')
const splitArrOnSmallArr = require('../splitArrOnSmallArr')
// const list = require('../list').flat(Infinity)
const config = require('../../config')
const settings = require('../../config/settings')
let list = require('../fromFile/symbol_list.json')
// list.length = 9;

list = list.map((i) => {
  let name = i.s.split('/')[0]
  // return name.replace('.', '_')
  return name
})
const stosks = new Set(list)
const matrix = splitArrOnSmallArr(Array.from(stosks), 3)
// matrix.length = 650

async function parse() {
  const browser = await puppeteer.launch(browserConfig)
  let result = []
  let count = 0
  console.time('start')
  const targetPrice = 'close'
  for (const arr of matrix) {
    console.log(`${count}:  ${arr}`)
    const promises = arr.map(async (symbol) => {
      const page = await browser.newPage()
      const data = await parseOneItem(page, symbol)
      return data
    })
    const f = await Promise.all(promises)
    result.push(...f)
    result = result.filter((item) => {
      const data = item.data[0]
      if (!data?.indicators?.quote?.[0]?.[targetPrice]) return false
      const check = methods.checkToBuy(
        data.indicators.quote[0][targetPrice],
        settings
      )
      // const check = checkToBuy(data.indicators.quote[0].open)
      return check
    })
    const symbolsList = result.map((i) => {
      const data = i.data[0]
      const arrPrice = data?.indicators?.quote?.[0]?.[targetPrice]
      const price = arrPrice[arrPrice.length - 1]
      const item = {
        symbol: i.symbol,
        price: new Intl.NumberFormat('ru-RU').format(price)
      }
      return item
    })
    console.log(symbolsList)

    ++count
  }
  console.timeEnd('start')
  const collectionName = config.db.collections.checkToBuy.name
  result = result.filter((item) => {
    const data = item.data[0]
    if (!data?.indicators?.quote?.[0]?.[targetPrice]) return false
    const check = methods.checkToBuy(data.indicators.quote[0][targetPrice], settings)
    // const check = checkToBuy(data.indicators.quote[0].open)
    return check
  })
  // const symbolsList = result.map((i) => i.symbol)
  const symbolsList = result.map((i) => {
    const data = i.data[0]
    const arrPrice = data?.indicators?.quote?.[0]?.[targetPrice]
    const price = arrPrice[arrPrice.length - 1]
    const item = {
      symbol: i.symbol,
      price: new Intl.NumberFormat('ru-RU').format(price)
    }
    return item
  })
  fs.writeFileSync(
    './parser/parseForCheckBuyStocks/parseResult.json',
    JSON.stringify(symbolsList, null, ' ')
  )
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
