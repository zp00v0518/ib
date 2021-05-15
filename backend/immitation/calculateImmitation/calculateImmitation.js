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
  console.time('s')
  Object.keys(allData).forEach((timestamp, index) => {
    settings.currMoment = +timestamp
    // const momentData = allData[timestamp];
    const start = settings.currMoment
    const end = start - maxLowPeriod * time.week
    const dataByPeriod = getDataByPeriod([end, start], allData)

		console.time('setStock')
    setStocksToList(dataByPeriod, allStocks, settings, index)
		console.timeEnd('setStock')
		
    portfolio.sellStocks()
    settings.setPartPrice()
    portfolio.buyStocksWhoDown()
    portfolio.buyStocks(allStocks, portfolio)
    // if (Number.isNaN(portfolio.cost)) {
		// 	return
    // }
  })
  console.timeEnd('s')
  return
}

function getDataByPeriod(range, data) {
  const times = Object.keys(data)
  const needs = times.filter((i) => +i >= range[0] && +i <= range[1])
  const result = {}
  needs.forEach((timestamp) => {
    result[timestamp] = data[timestamp]
  })
  return result
}

function setStocksToList(dataByPeriod, allStocks, settings, index) {
	if(index > 90){
		console.log(index)
	}
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
