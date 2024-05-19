const fs = require('fs')
const puppeteer = require('puppeteer')
const browserConfig = require('../browserConfig')
const parseOneItem = require('./parseOneItem')
const methods = require('../../backend/immitation/calculateImmitation/methods')
const saveResultToDB = require('../saveResultToDB')
const splitArrOnSmallArr = require('../splitArrOnSmallArr')
// const list = require('../list').flat(Infinity)
const config = require('../../config')
const settings = require('../../config/settings')
let list = require('../fromFile/s&p500_ally_year.json')
const sp500AllYear = require('../fromFile/s&p500_by_year.json')
// let list = require('../fromFile/symbol_list.json')

list = list.map((i) => {
  let name = i.s.split('/')[0]
  // return name.replace('.', '_')
  return name
})

let stosks = new Set(list)
if(settings.sp500Mode){
  let lastKey = Object.keys(sp500AllYear)
  lastKey = lastKey[lastKey.length -1]
  stosks = sp500AllYear[lastKey].arr
  console.log(123)

}
const matrix = splitArrOnSmallArr(Array.from(stosks), 3)

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
