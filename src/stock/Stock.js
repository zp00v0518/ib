import settings from '../store/modules/settings'

class Stock {
  constructor(symbol) {
    this.symbol = symbol
    this.data = {}
    this.maxPrice = 0
    this.lowPrice = 999999999999999
    this.price = 0
  }
  addData(data) {
    if (this.data[data.timestamp]) return;
    this.data[data.timestamp] = data
    this.price = data.close
    this.setMaxLowPrice(data)
  }
  setMaxLowPrice(data) {
    this.setMaxPrice(data.close)
    this.setLowPrice()
    return
  }
  setLowPrice() {
    const { state } = settings
    const { currMoment, maxLowPeriod } = state
    const endPeriod = currMoment - maxLowPeriod
    let endData = this.data[endPeriod]
    if (!endData) {
      endData = Object.values(this.data)[0]
    }
    if (this.lowPrice > endData.close) this.lowPrice = endData.close
  }
  setMaxPrice(value) {
    if (this.maxPrice < value) this.maxPrice = value
  }
}

export default Stock
