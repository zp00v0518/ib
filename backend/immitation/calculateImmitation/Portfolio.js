const template_func = require('template_func')

class Portfolio {
  constructor(settings) {
    this.curCash = settings.curCash
    this.list = {}
    this.cost = settings.curCash
    this.dividends = 0
    this.fixed = 0
    this.settings = settings
  }

  addStockToPortfolio(stock, qty) {
    const { list } = this
    const isStock = list[stock.symbol]
    if (isStock) {
      // докупаю акции и устанавливаю среднюю цену
      const prevCost = isStock.qty * isStock.buyPrice
      isStock.qty += qty
      const middle = (stock.price * qty + prevCost) / isStock.qty
      isStock.buyPrice = middle
      isStock.buyCount++
      return
    }
    list[stock.symbol] = {
      stock,
      qty,
      buyPrice: stock.price,
      dateBuy: stock.timestamp,
      buyCount: 0,
    }
  }
  reduceCurCash(value) {
    this.curCash -= value
  }
  addToCurCash(value) {
    this.curCash += value
  }
  countCost() {
    const { list, settings } = this
    const sums = Object.keys(list).map((symbol) => {
      const item = list[symbol]
      if (settings.withDividends) this.setDividends(item)
      if(!item.stock.price) return;
      const value = item.stock.price * item.qty
      item.cost = value
      item.change = +(item.stock.price / item.buyPrice).toFixed(3)
      return value
    })
    const baseCost = sums.reduce((acc, value) => {
      return (acc += value)
    }, 0)
    this.cost = baseCost + this.curCash
  }
  setDividends(portfolioItem) {
    const { settings } = this
    const { stock } = portfolioItem
    const momentData = stock.data[settings.currMoment]
    if (!momentData || !momentData.dividends) return
    const sum = portfolioItem.qty * momentData.dividends.amount
    this.dividends += sum
    this.addToCurCash(sum)
  }
  checkToBuy(stock) {
    const { price, lowPrice, maxPrice } = stock
    const { settings } = this
    if (price < settings.minPriceStock) return false
    if (price > settings.partPrice) return false
    if (!lowPrice) return false
    const bottomIndex = lowPrice / price
    if (bottomIndex > settings.checkBuyBottom) return false
    const topIndex = maxPrice / price
    if (topIndex < settings.checkBuyTop) return false
    return true
  }
  sellStocks(timestamp) {
    const { list } = this
    Object.keys(list).forEach((symbol) => {
      const item = list[symbol]
      if (this.checkToSell(item, timestamp)) {
        this.sellStock(item)
      }
    })
    this.countCost()
  }
  sellStock(item) {
    const sellPrice = item.change > 1.2 ? item.buyPrice * 1.2 : item.stock.price
    const sum = item.qty * sellPrice
    // TODO:  чуток прибыли откладываю в заначку
    let x = 0
    if (this.settings.fix) {
      if (item.change >= this.settings.checkSellTop) {
        const coef = (this.settings.checkSellTop - 1) * this.settings.fix
        x = sum * coef
        this.fixed += x
      }
    }

    this.addToCurCash(sum - x)
    delete this.list[item.stock.symbol]
  }
  checkToSell(item, timestamp) {
    const { settings } = this
    // const daysIn = (+timestamp - item.dateBuy) / 60 / 60 / 24
    // if (daysIn > 370 && +item.change > 1) return true

    // избавляюсь от акций, которые пришлось много докупать
    if (item.buyCount === settings.buyCount) {
      if (+item.change <= settings.checkSellBottom) return true
      // if(+item.change >= 1.01 || +item.change <= settings.checkSellBottom) return true
    }

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
  buyStock(stock) {
    const { settings, curCash } = this
    const { partPrice } = settings
    if (curCash < partPrice) return
    const qty = Math.floor(partPrice / stock.price)
    const purchase = qty * stock.price
    if (curCash < purchase) return
    this.addStockToPortfolio(stock, qty)
    this.reduceCurCash(purchase)
    this.countCost()
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
    const { curCash, settings, list } = this
    const { middle } = settings
    if (settings.partPrice > curCash) return
    Object.keys(list).forEach((symbol) => {
      if (settings.partPrice > curCash) return
      const portFolioItem = list[symbol]
      if (portFolioItem.change > middle) return
      if (portFolioItem.buyCount >= settings.buyCount) return
      const stock = portFolioItem.stock
      if (!stock) return
      this.buyStock(stock)
      this.countCost()
    })
  }
}

module.exports = Portfolio
