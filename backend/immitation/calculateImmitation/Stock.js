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
    this.minMaxArr = []
    this.lastData = {}
  }
  addData(data) {
    if (!data.o || !data.c) return
    // if (this.data[data.timestamp] || !data.open || !data.close) return
    const {currMoment} = this.settings
    this.data[currMoment] = data
    this.timestamp = currMoment
    this.lastData = data
    this.setPrice(data)
    this.setMaxLowPrice()
  }
  setPrice(data) {
    if (data.splits) {
      // this.setSplit(data)
    }
    // this.price = data.close * this.qty
    this.price = (data.c + data.o) / 2
    // this.price = (data.close + data.open) / 2
  }
  setSplit(data) {
    const { splits } = data
    this.qty = splits.denominator * this.qty
  }
  setMaxLowPrice() {
    const { settings } = this
    this.minMaxArr.push(this.price)
    if (this.minMaxArr.length > settings.maxLowPeriod) {
      this.minMaxArr.shift()
    }
    if (this.minMaxArr.length < settings.maxLowPeriod) return
    this.setMaxPrice()
    this.setLowPrice()
    return
  }
  setLowPrice() {
    this.lowPrice = Math.min(...this.minMaxArr)
  }
  setMaxPrice() {
    this.maxPrice = Math.max(...this.minMaxArr)
  }
}

module.exports = Stock
