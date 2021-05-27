class History {
  constructor(settings) {
    Object.keys(settings).forEach((key) => {
      this[key] = settings[key]
    })
    this.data = {}
    this.sellCoefList = null
    // this.itog = -1
    delete this.portfolio
  }
  setItog(portfolio) {
    this.dividends = portfolio.dividends
    this.cost = portfolio.cost
    this.fixed = portfolio.fixed
  }
  addItem(portfolio, timestamp) {
    const item = Object.assign({}, portfolio)
    const sellCoefList = item.sellCoefList
    this.sellCoefList = sellCoefList
    delete item.settings
    delete item.list
    delete item.sellCoefList
    delete item.bigSell
    delete item.sellCount
    delete item.timestamp
 
    const { list } = portfolio
    this.data[timestamp] = item
    item.list = {}
    if (this.full_history) {
      Object.keys(list).forEach((symbol) => {
        const z = list[symbol]
        const template = Object.assign({}, z)
        const stock = template.stock
        const qty = template.qty
        delete template.stock
        Object.assign(template, stock)
        template.qty = qty
        delete template.data
        delete template.minMaxArr
        delete template.lastData
        delete template.settings
        delete template.lowPrice
        delete template.maxPrice
        item.list[symbol] = template
        delete template.stock
      })
    }
  }
}

module.exports = History
