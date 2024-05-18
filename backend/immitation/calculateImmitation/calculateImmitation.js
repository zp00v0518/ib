const template_func = require('template_func')
const Stock = require('./Stock')
const Settings = require('./Settings')
const Portfolio = require('./Portfolio')
const History = require('./History')

function calculateImmitation(allData, ops) {
  const fixedCurcah = ops.curCash
  const startMoment = ops.currMoment
  const settings = new Settings(ops)
  const portfolio = new Portfolio(settings)
  settings.addPortfolio(portfolio)
  settings.setPartPrice()
  let allStocks = {}
  console.time('calculation time')
  let count = 0
  const history = new History(settings)
  Object.keys(allData).forEach((timestamp, index) => {
    settings.currMoment = +timestamp
    // const start = settings.currMoment
    const dataByPeriod = allData[timestamp]
    // const dataByPeriod = getDataByPeriod([start, start], allData)
    setStocksToList(dataByPeriod, allStocks, settings)
    portfolio.countCost()
    portfolio.sellStocks(timestamp)
    settings.setPartPrice()
    if (settings.topBuyCount > 0) {
      portfolio.buyStocksWho_UP()
    }
    if (settings.buyCount > 0) {
      portfolio.buyStocksWhoDown()
    }
    settings.setPartPrice()
    if (
      settings.partPrice < portfolio.cost &&
      Object.values(portfolio.list).length < settings.maxLengthPortfolio
    ) {
      portfolio.buyStocks(allStocks, portfolio)
    }
    if (index % settings.additionPeriod === 0) {
      portfolio.addToCurCash(settings.addition)
      count += settings.addition
    }
    // if (settings.buyCount > 0) {
    //   portfolio.buyStocksWhoDown()
    // }
    history.addItem(portfolio, timestamp)
    settings.incrementPortfoliLength(index)
  })
  history.setItog(portfolio)
  history.addCount = count
  console.timeEnd('calculation time')
  // Размер портфолио: ${Math.floor(portfolio.cost + portfolio.fixed)},00
  const sum = portfolio.cost + portfolio.fixed
  // ЕКжегодня доходность считается по формуле XIRR
  const year =
    new Date().getFullYear() - new Date(startMoment * 1000).getFullYear();
  console.log('Кол-во лет: ', year)
  // ежегодня доходность
  const annualYield =
    (Math.pow(sum / (count / 2 + fixedCurcah), 1 / year) - 1) * 100
  history.annualYield = annualYield
  console.log(`
  Размер портфолио: ${new Intl.NumberFormat('ru-RU').format(sum)} 
  Кол-во продаж: ${portfolio.sellCount} 
  Кол-во ТОП продаж: ${portfolio.bigSell} 
  Довложений:${count}
  Доходность:${((sum / (count / 2 + fixedCurcah)) * 100 - 100).toFixed(2)}%
  Абсолютный доход: ${new Intl.NumberFormat('ru-RU').format(
    sum - (fixedCurcah + count)
  )}
  Ежегодная доходность: ${annualYield.toFixed(2)}%
  `)
  return history
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

function setStocksToList(dataByPeriod, allStocks, settings) {
  // Object.keys(dataByPeriod).forEach((timestamp) => {
  const moment = dataByPeriod
  // const moment = dataByPeriod[timestamp]
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
  // })
  return allStocks
}

module.exports = calculateImmitation
