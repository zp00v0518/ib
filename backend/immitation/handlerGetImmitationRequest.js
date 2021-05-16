const { getAllSplitData } = require('./db')
const calculateImmitation = require('./calculateImmitation');

let settings = {
  stepTime: 60 * 60 * 24,
  currMoment: 1104762600,
  // currMoment: 1262615400,
  maxLowPeriod: 13 * 7,
  partPrice: 0,
  middle: 0.5,
  minPriceStock: 0.4,
  // checkBuyBottom: 0.5,
  checkBuyBottom: 0.8,
  checkBuyTop: 1.6,
  // checkBuyTop: 1.3,
  checkSellBottom: 0.1,
  checkSellTop: 1.1,
  maxLengthPortfolio: 20,
  curCash: 3000,
  buyCount: 2,
  addition: 500,
  additionPeriod: 360,
  withDividends: false
}
const stockData = {};
async function handlerGetImmitationRequest(requestData) {
  const { type, data } = requestData
  settings = Object.assign(settings, data)
  const message = {
    type,
    data: settings,
  }
  console.time("Запрос")
  const allData = await getAllSplitData()
  console.timeEnd("Запрос")
  allData.forEach(item => {
		const timestamp = item.timestamp;
		delete item._id;
		delete item.timestamp;
		stockData[timestamp] = item
	})
  for (let i = 0; i < 20; i++) {
    const ops = Object.assign({}, settings)
    calculateImmitation(stockData, ops);
  }
  return message
}

module.exports = handlerGetImmitationRequest
