const template_func = require('template_func')

class Portfolio {
  constructor(settings) {
    this.curCash = settings.curCash
    this.list = {}
    this.cost = settings.curCash
    this.dividends = 0
    this.fixed = 0
    this.settings = settings
    this.sellCount = 0
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
      if (!item.stock.price) return
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
    if (price > 1000) return false
    if (price > settings.partPrice) return false
    if (!lowPrice || !maxPrice) return false
    const { minMaxArr } = stock
    if (minMaxArr.length < settings.maxLowPeriod) return false

    // const topCoef = maxPrice / price
    // if (topCoef < settings.checkBuyTop) return false

    // const renkoResult = this.checkBuyRenko(minMaxArr)
    // if (!renkoResult) return false

    // const topIndex = 50
    // const bottomIndex = 5
    // const topPrice = minMaxArr[minMaxArr.length - topIndex]
    // const bottomPrice = minMaxArr[minMaxArr.length - bottomIndex]
    // if (!bottomPrice || !topPrice || !price) return false

    // const bottomCoef = topPrice / bottomPrice
    // if (bottomCoef < 1.9) return false
    // const nowCoef = price / bottomPrice
    // if (nowCoef < 1.1) return false

    const topCoef = maxPrice / price
    if (topCoef < settings.checkBuyTop) return false
    const bottomCoef = lowPrice / price
    if (bottomCoef > settings.checkBuyBottom) return false

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
    const { settings } = this
    const { checkSellTop } = settings
    // const sellPrice = item.buyPrice * item.change
    const sellPrice = item.change > 1.5 ? item.buyPrice * 1.5 : item.stock.price
    
    // const sellPrice = item.stock.price;
    // const sellPrice =
    //   +item.change > checkSellTop
    //     ? item.buyPrice * checkSellTop
    //     : item.stock.price
    if (item.change > 4){
      console.log()
    }
    const sum = item.qty * sellPrice
    let x = 0
    if (settings.fix) {
      if (item.change >= checkSellTop) {
        const cream = sum - item.buyPrice * item.qty
        x = cream * settings.fix
        this.fixed += x
      }
    }

    this.addToCurCash(sum - x)
    delete this.list[item.stock.symbol]
    this.sellCount++
  }
  checkToSell(item, timestamp) {
    const { change } = item
    const { settings } = this
    // const daysIn = (+timestamp - item.dateBuy) / 60 / 60 / 24
    // if (daysIn > 370 && change > 1.03) return true

    // избавляюсь от акций, которые пришлось много докупать
    if (settings.buyCount && item.buyCount >= settings.buyCount) {
      if (change <= settings.middle) return true
      if (change >= 1.03) return true
    }
    const flag =
      change <= settings.checkSellBottom || change >= settings.checkSellTop
    if (flag) {
      console.log()
    }
    return flag
    // if (item.buyPrice >= item.stock.price) {
    //   return +item.change < settings.checkSellBottom
    // }
    // return +item.change > settings.checkSellTop
  }
  buyStocks(allStocks) {
    const { curCash, settings } = this
    if (curCash < settings.partPrice) return
    const candidateToBy = this.getCandidateToBuy(allStocks)
    const targetStock = this.getRandomStock(candidateToBy)
    if (!targetStock) return
    this.buyOneStock(targetStock)
  }
  buyOneStock(stock) {
    const { settings, curCash } = this
    const { partPrice } = settings
    if (curCash < partPrice) return
    const qty = Math.floor(partPrice / stock.price)
    const purchase = qty * stock.price
    if (curCash < purchase) return
    if (curCash < 0) {
      console.log()
    }
    if(stock.price === 1){
      console.log()
    }
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
    // const z = candidateToBy.map(i => i.symbol);
    // console.log(z)
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
      this.buyOneStock(stock)
      this.countCost()
    })
  }
  getRenkoChart(arr, persent = 10) {
    let step = (arr[0] / 100) * persent
    const result = []
    let lastValue = arr[0]
    arr.forEach((i) => {
      const dif = i - lastValue
      if (Math.abs(dif) > step) {
        const flag = dif > 0
        result.push(flag)
        lastValue = i
        step = (i / 100) * persent
      }
    })
    return result
  }
  checkBuyRenko(minMaxArr) {
    const { settings } = this
    const renkoChart = this.getRenkoChart(minMaxArr, settings.renkoGrow)
    const checkValue = false
    const downArr = []
    const upArr = [true]
    let templateArr = []
    // templateArr = this.getDoubleVFigure();
    // for (let i = 0; i < 2; i++) {
    //   templateArr.push(...downArr)
    //   templateArr.push(...upArr)
    // }
    templateArr.push(...upArr)
    if (renkoChart.length < templateArr.length) return false
    // const flag = checkArr.every((i) => i === checkValue)
    const checkArr = renkoChart.splice(0 - templateArr.length)
    const flag = checkArr.every((i, index) => {
      return i === templateArr[index]
    })
    if (flag) {
      console.log()
    }
    return flag
  }
  getDoubleVFigure(size = 2, length = 2) {
    const down = Array(size).fill(false)
    const up = Array(size).fill(true)
    const result = []
    for (let i = 0; i < length; i++) {
      result.push(...down)
      result.push(...up)
    }
    return result
  }
}

module.exports = Portfolio
