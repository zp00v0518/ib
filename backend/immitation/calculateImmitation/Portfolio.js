const template_func = require('template_func')

class Portfolio {
  constructor(settings) {
    this.curCash = settings.curCash
    this.list = {}
    this.cost = settings.curCash
    this.settings = settings
  }
  buyStock(stock) {
    const { settings, curCash } = this
    const { partPrice } = settings
    if (stock.price < curCash) return
    const qty = Math.floor(partPrice / stock.price)
    const purchase = qty * stock.price
    this.addStockToPortfolio(stock, aty)
    this.reduceCurCash(purchase)
    this.countCost()
  }
  addStockToPortfolio(stock, qty) {
    this.list[stock.symbol] = {
      stock,
      qty,
      buyPrice: stock.price,
      dateBuy: stock.timestamp,
    }
  }
  reduceCurCash(value) {
    this.curCash -= value
  }
  addToCurCash(value) {
    this.curCash += value
  }
  countCost() {
    const { list } = this
    const sums = Object.keys(list).map((symbol) => {
      const item = list[symbol]
      const value = item.stock.price * item.qty
      item.cost = value
      item.change = +(item.stock.price / item.buyPrice).toFixed(2)
      return value
    })
    const baseCost = sums.reduce((acc, value) => {
      return (acc += value)
    }, 0)
    this.cost = baseCost + this.curCash
  }
  checkToBuy(stock) {
    const { price, lowPrice, maxPrice } = stock
    const { settings } = this
    if (price < settings.minPriceStock) return false
    if (price > settings.partPrice) return false
    if (!lowPrice) return false
    if (lowPrice / price > settings.checkBuyBottom) return false
    if (maxPrice / price < settings.checkBuyTop) return false
    return true
  }
  sellStocks() {
    const { list, checkToSell } = this
    Object.keys(list).forEach((symbol) => {
      const item = list[symbol]
      if (checkToSell(item)) {
        sellStock(item)
      }
    })
    this.countCost()
  }
  sellStock(stock) {
    const sellPrice =
      stock.change > 1.2 ? stock.buyPrice * 1.2 : stock.stock.price
    const sum = item.qty * sellPrice
    this.addToCurCash(sum)
    delete this.list[stock.symbol]
  }
  checkToSell(item) {
    const { settings } = this
    if (item.buyPrice >= item.stock.price) {
      return +item.change < settings.checkSellBottom
    }
    return +item.change > settings.checkSellTop
  }
  buyStocks(allStocks) {
    const { curCash, settings } = this
    if (curCash < settings.partPrice) return
    const candidateToBy = this.getCandidateToBuy(allStocks)
    const targetStock = this.getRandomStock(candidateToBy)
    if (!targetStock) return
    this.buyStock(targetStock)
  }
  getCandidateToBuy(allStocks) {
    const { list } = this
    let candidateToBy = []
    Object.keys(allStocks).forEach((symbol) => {
      const stock = allStocks[symbol]
      if (this.checkToBuy(stock)) {
        candidateToBy.push(stock)
      }
    })
    const listUse = Object.keys(list)
    candidateToBy = candidateToBy.filter((i) => !listUse.includes(i.symbol))
    return candidateToBy
  }
  getRandomStock(arr) {
    const index = template_func.getRandomNumber(arr.length - 1)
    return arr[index]
  }
  buyStocksWhoDown() {
    const { curCash, settings, list, countCost, buyStock } = this
    const { middle } = settings
    if (settings.partPrice > curCash) return
    Object.keys(list).forEach((symbol) => {
      if (settings.partPrice > curCash) return
      if (list[symbol].change < middle) {
        const stock = list[symbol].stock
        if (!stock) return
        buyStock(stock)
        countCost()
      }
    })
  }
}

module.exports = Portfolio
