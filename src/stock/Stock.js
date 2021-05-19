import settings from '../store/modules/settings'

class Stock {
  constructor(symbol) {
    this.symbol = symbol
    this.data = {}
    this.maxPrice = 0
    this.lowPrice = 0
    this.price = 0
    this.qty = 1
    this.timestamp = 0
    this.minMaxArr = []
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
    const { minMaxArr } = this
    const { state } = settings

    minMaxArr.push(this.price)
    if (minMaxArr.length > state.maxLowPeriod * 7) {
      minMaxArr.shift()
    }
    if (minMaxArr.length < state.maxLowPeriod * 7) return
    this.setMaxPrice(data.open)
    this.setLowPrice()
    return
  }
  setLowPrice() {
    this.lowPrice = Math.min(...this.minMaxArr)

    // const { state } = settings
    // const { currMoment, maxLowPeriod } = state
    // const endPeriod = currMoment - (time.week / 1000) * maxLowPeriod
    // let endData = this.data[endPeriod]
    // if (!endData) {
    //   // endData = Object.values(this.data)[0]
    //   return
    // }
    // if (this.lowPrice > endData.open) this.lowPrice = this.qty * endData.open
  }
  setMaxPrice(value) {
    this.maxPrice = Math.max(...this.minMaxArr)
    // if (this.maxPrice < value) this.maxPrice = this.qty * value
  }
}

export default Stock
