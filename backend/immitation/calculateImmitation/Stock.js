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
    if (this.data[data.timestamp] || !data.open) return
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
    if (this.price === 0) {
      return 
    }
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
}

module.exports = Stock
