const { getAllSplitData } = require('./db')
const {saveHistoryInDB} = require('../history/db');
const calculateImmitation = require('./calculateImmitation')
const settings = require('../../config/settings')

// let settings = {
//   stepTime: 60 * 60 * 24 * 2,
//   currMoment: 1104762600,
//   maxLowPeriod: 13 * 7,
//   middle: 0.5,
//   minPriceStock: 0.4,
//   checkBuyBottom: 0.5,
//   // checkBuyBottom: 0.8,
//   checkBuyTop: 2,
//   // checkBuyTop: 1.3,
//   checkSellBottom: 0.1,
//   checkSellTop: 1.1,
//   buyCount: 2,
//   addition: 500,
//   additionPeriod: 180,
//   withDividends: true,
//   partPrice: 0,
//   maxLengthPortfolio: 20,
//   curCash: 3000,
// }
const stockData = {}
async function handlerGetImmitationRequest(requestData) {
  const { type, data } = requestData
  settings = Object.assign(settings, data)
  const message = {
    type,
    data: settings,
  }
  console.time('Запрос')
  const allData = await getAllSplitData(settings)
  console.timeEnd('Запрос')
  allData.forEach((item) => {
    const timestamp = item.timestamp
    delete item._id
    delete item.timestamp
    stockData[timestamp] = item
  })
  for (let i = 0; i < 10; i++) {
    const ops = Object.assign({}, settings)
    const history = calculateImmitation(stockData, ops)
    await saveHistoryInDB(history)
  }
  console.log('end imitation')
  return message
}

module.exports = handlerGetImmitationRequest
