const Stock = require('./Stock')
const Settings = require('./Settings')
const Portfolio = require('./Portfolio')
const time = require('../../../config').time

function calculateImmitation(allData, ops) {
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
		// portfolio.buyStocksWhoDown();
		portfolio.buyStocks(allStocks, portfolio);
  })
  return
}
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

module.exports = calculateImmitation
