const checkBuyRenko = require('./checkBuyRenko')

function checkToBuy(stock) {
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
    const renkoResult = checkBuyRenko(minMaxArr, this.settings)
    if (!renkoResult) return false
  }

  return true
}

module.exports = checkToBuy
