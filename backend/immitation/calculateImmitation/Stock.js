const time = require('../../../config').time

class Stock {
  constructor(symbol, settings) {
    this.symbol = symbol
    this.data = {}
    this.maxPrice = 0
    this.lowPrice = 999999999999999
    this.price = 0
    this.qty = 1 // планировалось использовать при split акции
    this.timestamp = 0
    this.settings = settings
  }
  addData(data) {
    if (this.data[data.timestamp]) return
    this.data[data.timestamp] = data
    this.timestamp = data.timestamp
    this.setPrice(data)
    this.setMaxLowPrice(data)
  }
  setPrice(data) {
    if (data.splits) {
      this.setSplit(data)
    }
    this.price = data.open * this.qty
  }
  setSplit(data) {
    const { splits } = data
    // this.qty = splits.denominator * this.qty;
  }
  setMaxLowPrice(data) {
    this.setMaxPrice(data.open)
    this.setLowPrice()
    return
  }
  setLowPrice() {
    const { currMoment, maxLowPeriod } = this.settings
    const endPeriod = currMoment - (time.week / 1000) * maxLowPeriod
    let endData = this.data[endPeriod]
    if (!endData) {
      // endData = Object.values(this.data)[0]
      return
    }
    if (this.lowPrice > endData.open) this.lowPrice = this.qty * endData.open
  }
  setMaxPrice(value) {
    if (this.maxPrice < value) this.maxPrice = this.qty * value
  }
  // checkToBuy() {
  //   const { settings, price, lowPrice, maxPrice } = this
  //   if (price < settings.minPriceStock) return false
  //   if (price > settings.partPrice) return false
  //   if (!lowPrice) return false
  //   if (lowPrice / price > settings.checkBuyBottom) return false
  //   if (maxPrice / price < settings.checkBuyTop) return false
  //   return true
  // }
  // checkToSell(portfolioItem) {
  //   const { settings } = this
  //   if (item.buyPrice >= item.stock.price) {
  //     return +item.change < settings.checkSellBottom
  //   }
  //   return +item.change > settings.checkSellTop
  // }
}

module.exports = Stock
