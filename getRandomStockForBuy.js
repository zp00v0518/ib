const template_func = require('template_func')
const getFindMethod = require('./traide/getFindMethod')
const config = require('./config')
const list = require('./parser/parseForCheckBuyStocks/parseResult.json')
const checkToBuy = require('./parser/parseForCheckBuyStocks/checkToBuy')

async function start() {
  const index = template_func.getRandomNumber(list.length - 1)
  // const symbol = 'SLLN';
  const symbol = list[index]
  const find = await getFindMethod()
  const collectionName = config.db.collections.checkToBuy.name
  const query = {
    symbol,
  }
  const result = await find.one(collectionName, {query})
  const data = result.data[0];
  find.close()
  if (
    !data ||
    !data.indicators ||
    !data.indicators.quote ||
    !data.indicators.quote[0]
  )
    return false
  const check = checkToBuy(data.indicators.quote[0].open)
  console.log(symbol, '   ', check)
}

start()
