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
    if (this.data[data.timestamp] || !data.open) return
    this.data[data.timestamp] = data
    this.timestamp = data.timestamp
    this.lastData = data
    this.setPrice(data)
    this.setMaxLowPrice()
  }
  setPrice(data) {
    if (data.splits) {
      // this.setSplit(data)
      if (data.splits.denominator < 3){
        console.log()
      }
    }
    this.price = data.close * this.qty
  }
  setSplit(data) {
    const { splits } = data
    this.qty = splits.denominator * this.qty;
  }
  setMaxLowPrice() {
    const {minMaxArr, settings} = this;
    minMaxArr.push(this.price);
    if (minMaxArr.length > settings.maxLowPeriod){
      minMaxArr.shift();
    }
    if (minMaxArr.length < settings.maxLowPeriod) return;
    this.setMaxPrice()
    this.setLowPrice()
    return
  }
  setLowPrice() {
    this.lowPrice = Math.min(...this.minMaxArr);
  }
  setMaxPrice() {
    this.maxPrice = Math.max(...this.minMaxArr);
  }
}

module.exports = Stock
