class Settings {
  constructor(settings) {
    // this.stepTime = 60 * 60 * 24
    // this.currMoment = 1262615400
    // this.maxLowPeriod = 2
    // this.partPrice = 0
    // this.middle = 0.5
    // this.minPriceStock = 0.1
    // this.checkBuyBottom = 0.8
    // this.checkBuyTop = 1.3
    // this.checkSellBottom = 0.1
    // this.checkSellTop = 1.1
    // this.maxLengthPortfolio = 15
    // this.curCash = 3000
    // this.icrementPortfolio = false
    const that = this
    Object.keys(settings).forEach((key) => {
      that[key] = settings[key]
    })
  }
  addPortfolio(e) {
    this.portfolio = e
  }
  setPartPrice() {
    const value = this.portfolio.cost / this.maxLengthPortfolio
    this.partPrice = value < 100 ? 100 : value
  }
  incrementPortfoliLength(index) {
    if (!this.icrementPortfolio) return
    if (index % 365*6 !== 0) return
    this.maxLengthPortfolio++
  }
}

module.exports = Settings
