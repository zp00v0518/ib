const getRenkoChart = require('./getRenkoChart')

function checkBuyRenko(minMaxArr, settings) {
  // const { settings } = this
  const renkoChart = getRenkoChart(minMaxArr, settings.renkoGrow)
  let templateArr = settings.renkoArr
  if (renkoChart.length < templateArr.length) return false
  const checkArr = renkoChart.splice(0 - templateArr.length)
  const flag = checkArr.every((i, index) => {
    return !!i === !!templateArr[index]
  })
  return flag
}

module.exports = checkBuyRenko
