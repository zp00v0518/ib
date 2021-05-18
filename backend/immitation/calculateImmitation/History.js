class History {
  constructor(settings) {
    Object.keys(settings).forEach((key) => {
      this[key] = settings[key]
    })
    this.data = {}
    // this.itog = -1
		delete this.portfolio;
  }
  setItog(portfolio) {
    this.dividends = portfolio.dividends;
    this.cost = portfolio.cost;
    this.fixed = portfolio.fixed;
  }
  addItem(portfolio, timestamp) {
    const item = Object.assign({}, portfolio)
    delete item.settings
    delete item.list
    const { list } = portfolio
    this.data[timestamp] = item
		// item.list = {};
    // Object.keys(list).forEach((symbol) => {
    //   const z = list[symbol]
    //   const template = Object.assign({}, z)
    //   const stock = template.stock
    //   delete template.stock
		// 	Object.assign(template, stock)
		// 	delete template.data;
		// 	delete template.minMaxArr;
		// 	delete template.settings;
    //   item.list[symbol] = template
    //   delete template.stock
    // })
  }
}

module.exports = History
