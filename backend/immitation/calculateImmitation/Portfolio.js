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
    this.bigSell = 0
    // this.extraCurcash = 0
    this.sellCoefList = {}
  }

  addStockToPortfolio(stock, qty) {
    const { list } = this
    const isStock = list[stock.symbol]
    if (isStock) {
      const { settings } = this
      // докупаю акции и устанавливаю среднюю цену
      const prevCost = isStock.qty * isStock.buyPrice
      isStock.qty += qty
      const middle = (stock.price * qty + prevCost) / isStock.qty
      isStock.buyPrice = middle
      if (isStock.change <= settings.middle) {
        isStock.buyCount++
        return
      }
      if (isStock.change >= settings.topMiddle) isStock.topBuyCount++
      return
    }
    list[stock.symbol] = {
      stock,
      qty,
      buyPrice: stock.price,
      dateBuy: stock.timestamp,
      buyCount: 0,
      topBuyCount: 0,
    }
  }
  reduceCurCash(value) {
    this.curCash -= value
  }
  addToCurCash(value) {
    this.curCash += value
    if (this.curCash < 0) {
      console.log()
    }
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
    // if (price > 1000) return false
    if (price > settings.partPrice) return false
    if (!lowPrice || !maxPrice) return false
    const { minMaxArr } = stock
    if (minMaxArr.length < settings.maxLowPeriod) return false

    if (settings.checkBuyTop > 0) {
      const topCoef = maxPrice / price
      if (topCoef < settings.checkBuyTop) return false
    }

    if (settings.checkBuyBottom > 0) {
      const bottomCoef = lowPrice / price
      if (bottomCoef > settings.checkBuyBottom) return false
    }
    if (settings.renkoArr && settings.renkoArr.length > 0) {
      const renkoResult = this.checkBuyRenko(minMaxArr)
      if (!renkoResult) return false
    }

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
    const { change } = item
    const { settings } = this
    const { checkSellTop, maxCoef } = settings
    // const maxCoef = checkSellTop
    const key = change > maxCoef && maxCoef !== 0 ? maxCoef : change.toFixed(2)
    if (!this.sellCoefList[key]) this.sellCoefList[key] = 0
    this.sellCoefList[key]++

    const sellPrice =
      change > maxCoef && maxCoef !== 0
        ? item.buyPrice * maxCoef
        : item.stock.price
    if (change > checkSellTop) this.bigSell++

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
    const { topBuyCount, checkSellTop, buyCount, sellRenkoArr } = settings
    // const daysIn = (+timestamp - item.dateBuy) / 60 / 60 / 24
    // if (daysIn > 370 && change > 1.03) return true

    // избавляюсь от акций, которые пришлось много докупать
    if (buyCount && item.buyCount >= buyCount) {
      if (change <= settings.middle) return true
      // if (change >= 1.03) return true
    }
    if (change <= settings.checkSellBottom) return true
    if (change >= checkSellTop) {
      let flag = true
      if (sellRenkoArr && sellRenkoArr.length > 0) {
        const { minMaxArr } = item.stock
        const renkoArr = this.getRenkoChart(minMaxArr)
        flag = renkoArr.every((i, index) => {
          return !!i === !!sellRenkoArr[index]
        })
        if (flag) return false
      }
      if (item.topBuyCount >= topBuyCount) return true
    }

    return false
  }
  buyStocks(allStocks) {
    const { curCash, settings } = this
    if (curCash < settings.partPrice) return
    const candidateToBy = this.getCandidateToBuy(allStocks)
    const targetStock = this.getRandomStock(candidateToBy)
    if (!targetStock) return
    // candidateToBy.forEach((item) => {
    //   this.buyOneStock(item)
    // })
    this.buyOneStock(targetStock)
    // this.buyAllStock(candidateToBy)
  }
  // buyAllStock(arr) {
  //   const { settings } = this
  //   const { partPrice } = settings

  //   arr.forEach((stock) => {
  //     let qty = Math.floor(partPrice / stock.price)
  //     let purchase = qty * stock.price
  //     if (this.curCash < purchase) {
  //       const add = 100
  //       qty = Math.floor(add / stock.price)
  //       if (qty < 0) return
  //       purchase = qty * stock.price
  //       this.addToCurCash(add)
  //       this.extraCurcash += add
  //     }
  //     this.addStockToPortfolio(stock, qty)
  //     this.reduceCurCash(purchase)
  //     this.countCost()
  //   })
  // }

  buyOneStock(stock) {
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
    const z = candidateToBy.map((i) => i.symbol)
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
  buyStocksWho_UP() {
    const { curCash, settings, list } = this
    const { topMiddle } = settings
    if (settings.partPrice > curCash) return
    Object.keys(list).forEach((symbol) => {
      if (settings.partPrice > curCash) return
      const portFolioItem = list[symbol]
      if (portFolioItem.change < topMiddle) return
      if (portFolioItem.topBuyCount >= settings.topBuyCount) return
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
    let templateArr = settings.renkoArr
    if (renkoChart.length < templateArr.length) return false
    const checkArr = renkoChart.splice(0 - templateArr.length)
    const flag = checkArr.every((i, index) => {
      return !!i === !!templateArr[index]
    })
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
