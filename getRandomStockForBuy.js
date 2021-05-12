const template_func = require('template_func')
const getFindMethod = require('./traide/getFindMethod')
const config = require('./config')
const list = require('./parser/parseForCheckBuyStocks/parseResult.json')

async function start() {
  const index = template_func.getRandomNumber(list.length - 1)
  const symbol = 'MWK';
  // const symbol = list[index]
  const find = await getFindMethod()
  const collectionName = config.db.collections.checkToBuy.name
  const query = {
    symbol,
  }
  const result = await find.one(collectionName, {query})
	const data = result.data[0];
  find.close()
}

start()
