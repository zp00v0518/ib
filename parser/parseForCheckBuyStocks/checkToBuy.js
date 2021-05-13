function checkToBuy(values) {
  if (!values) return false;
  const price = values[values.length - 1]
  if (!price || price < 0.1 || price > 90) return false;
  const min = Math.min(...values)
  if(!min) return false;
  const max = Math.max(...values)
  if (min / price > 0.6) return false
  if (max / price < 1.4) return false
  console.log("Last price:", '  ', price);
  return true
}

module.exports = checkToBuy