const { getAllSplitData } = require('./db')
const calculateImmitation = require('./calculateImmitation');

let settings = {
  stepTime: 60 * 60 * 24,
  currMoment: 1262615400,
  maxLowPeriod: 2,
  partPrice: 0,
  middle: 0.5,
  minPriceStock: 0.1,
  checkBuyBottom: 0.8,
  checkBuyTop: 1.3,
  checkSellBottom: 0.1,
  checkSellTop: 1.1,
  maxLengthPortfolio: 15,
  curCash: 3000,
}
const stockData = {};
async function handlerGetImmitationRequest(requestData) {
  const { type, data } = requestData
  settings = Object.assign(settings, data)
  const message = {
    type,
    data: settings,
  }
  const allData = await getAllSplitData()
  allData.forEach(item => {
		const timestamp = item.timestamp;
		delete item._id;
		delete item.timestamp;
		stockData[timestamp] = item;
	})
	calculateImmitation(stockData, settings);
  return message
}

module.exports = handlerGetImmitationRequest
