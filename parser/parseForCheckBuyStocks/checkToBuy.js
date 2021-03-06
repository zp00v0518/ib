const settings = require('../../config/settings')

function checkToBuy(values) {
  if (!values) return false
  const price = values[values.length - 1]
  if (!price || price < settings.minPriceStock) return false
  const min = Math.min(...values)
  if (!min) return false
  const max = Math.max(...values)

  if (settings.checkBuyBottom > 0) {
    if (min / price > settings.checkBuyBottom) return false
  }
  
  if (settings.checkBuyTop > 0) {
    if (max / price < settings.checkBuyTop) return false
  }
  console.log('Last price:', '  ', price)
  return true
}

module.exports = checkToBuy
