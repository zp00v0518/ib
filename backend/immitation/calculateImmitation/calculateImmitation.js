const template_func = require('template_func')
const Stock = require('./Stock')
const Settings = require('./Settings')
const Portfolio = require('./Portfolio')
const History = require('./History')

function calculateImmitation(allData, ops, index) {
  // ops.checkSellTop = template_func.getRandomNumber(1.05, 10);
  // ops.checkBuyTop = template_func.getRandomNumber(1.5, 10);
  // // ops.checkSellTop = +(Math.random()+1).toFixed(2);
  // // ops.middle = +(Math.random()).toFixed(1);
  // ops.fix = template_func.getRandomNumber();
  // // ops.fix = +(Math.random()).toFixed(1);
  // ops.buyCount = template_func.getRandomNumber(0, 25)
  // ops.renkoGrow = template_func.getRandomNumber(1, 100)

  const fixedCurcah = ops.curCash
  const settings = new Settings(ops)
  const portfolio = new Portfolio(settings)
  settings.addPortfolio(portfolio)
  settings.setPartPrice()
  let allStocks = {}
  console.time('s')
  let count = 0
  const history = new History(settings)
  Object.keys(allData).forEach((timestamp, index) => {
    settings.currMoment = +timestamp
    // const start = settings.currMoment
    const dataByPeriod = allData[timestamp];
    // const dataByPeriod = getDataByPeriod([start, start], allData)
    setStocksToList(dataByPeriod, allStocks, settings)
    portfolio.countCost()
    portfolio.sellStocks(timestamp)
    settings.setPartPrice()
    if (settings.topBuyCount > 0) {
      portfolio.buyStocksWho_UP()
    }
    // if (settings.buyCount > 0) {
    //   portfolio.buyStocksWhoDown()
    // }
    settings.setPartPrice()
    if (settings.partPrice < portfolio.cost) {
      portfolio.buyStocks(allStocks, portfolio)
    }
    if (index % settings.additionPeriod === 0) {
      portfolio.addToCurCash(settings.addition)
      count += settings.addition
    }
    if (settings.buyCount > 0) {
      portfolio.buyStocksWhoDown()
    }
    history.addItem(portfolio, timestamp)
    settings.incrementPortfoliLength(index)
  })
  history.setItog(portfolio)
  history.addCount = count
  console.timeEnd('s')
  // Размер портфолио: ${Math.floor(portfolio.cost + portfolio.fixed)},00
  console.log(`
  Размер портфолио: ${new Intl.NumberFormat('ru-RU').format(
    portfolio.cost + portfolio.fixed
  )} 
  Кол-во продаж: ${portfolio.sellCount} 
  Кол-во ТОП продаж: ${portfolio.bigSell} 
  Довложений:${count}
  Доходность:${(
    ((portfolio.cost + portfolio.fixed) / (count + fixedCurcah)) * 100 -
    100
  ).toFixed(2)}%
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
    const moment = dataByPeriod;
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
