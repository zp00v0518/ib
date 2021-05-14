const template_func = require('template_func')
const Stock = require('./Stock')
const Settings = require('./Settings')
const Portfolio = require('./Portfolio')
const time = require('../../../config').time

let ops = {
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

function calculateImmitation(allData) {
  const settings = new Settings(ops)
  const portfolio = new Portfolio(settings)
  settings.addPortfolio(portfolio)
  settings.setPartPrice()
  const { maxLowPeriod, stepTime } = settings
  settings.currMoment = settings.currMoment + stepTime
  let allStocks = {}
	// const log = getLogTemplate()
  Object.keys(allData).forEach((timestamp, index) => {
    settings.currMoment = +timestamp
    // const momentData = allData[timestamp];
    const start = settings.currMoment
    const end = start - maxLowPeriod * time.week
    const dataByPeriod = getDataByPeriod([end, start], allData)
    setStocksToList(dataByPeriod, allStocks, settings)
		portfolio.sellStocks();
		portfolio.buyStocksWhoDown();
		portfolio.buyStocks(allStocks, portfolio);
  })
  return
}
// function buyStocks(allStocks, portfolio){
// 	const candidateToBy = getCandidateToBuy(allStocks, portfolio)
// 	const targetStock = getRandomStock(candidateToBy)
// 	if(!targetStock) return;
// 	portfolio.buyStock(targetStock)
// }
function getDataByPeriod(range, data) {
  // const times = Object.keys(data)
  //   .map((i) => +i)
  //   .sort((a, b) => a - b)
  // let endIndex = times.indexOf(range[0])
  // endIndex = endIndex === -1 ? 0 : endIndex
  // const startIndex = times.indexOf(range[1])
  const times = Object.keys(data)
  const needs = times.filter((i) => +i >= range[0] && +i <= range[1])
  // const needs = times.splice(endIndex, startIndex)
  const result = {}
  needs.forEach((timestamp) => {
    result[timestamp] = data[timestamp]
  })
  return result
}
// function getCandidateToBuy(allStocks, portfolio) {
//   const candidateToBy = []
//   Object.keys(allStocks).forEach((symbol) => {
//     const stock = allStocks[symbol]
//     if (portfolio.checkToBuy(stock)) {
//       candidateToBy.push(stock)
//     }
//   })
//   // const listUse = Object.keys(portfolio.list)
//   // this.candidateToBy = this.candidateToBy.filter(
//   // 	(i) => !listUse.includes(i.symbol)
//   // )
//   return candidateToBy
// }
function setStocksToList(dataByPeriod, allStocks, settings) {
  Object.keys(dataByPeriod).forEach((timestamp) => {
    const moment = dataByPeriod[timestamp]
    Object.keys(moment).forEach((symbol) => {
      if (allStocks[symbol]) {
        const item = moment[symbol]
        allStocks[symbol].addData(item)
        return
      }
      const item = new Stock(symbol, settings)
      item.addData(moment[symbol])
      allStocks[symbol] = item
    })
  })
  return allStocks
}
// function getRandomStock(arr) {
// 	const index = template_func.getRandomNumber(arr.length - 1)
// 	return arr[index]
// };
module.exports = calculateImmitation
