const checkBuyRenko = require('./checkBuyRenko')

function checkToBuy(stock, settings) {
  const vars = getVariables(stock)
  const { price, lowPrice, maxPrice, minMaxArr } = vars
  if (price < settings.minPriceStock) return false
  if (settings.partPrice > 0 && price > settings.partPrice) return false
  if (!lowPrice || !maxPrice) return false
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
    const renkoResult = checkBuyRenko(minMaxArr, settings)
    if (!renkoResult) return false
  }

  return true
}

function getVariables(elem) {
  if (!Array.isArray(elem)) return elem
  const price = elem[elem.length - 1]
  const lowPrice = Math.min(...elem)
  const maxPrice = Math.max(...elem)
  const minMaxArr = elem
  return {
    price,
    lowPrice,
    maxPrice,
    minMaxArr,
  }
}

module.exports = checkToBuy
