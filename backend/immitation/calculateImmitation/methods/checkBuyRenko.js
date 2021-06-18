const getRenkoChart = require('./getRenkoChart')

function checkBuyRenko(minMaxArr, settings) {
  // const { settings } = this
  // const renkoChart = getRenkoChart(minMaxArr, settings.renkoGrow)

  // постройка графика идет задом-наперед, т.е, начинается сегодня и уходит в прошлое
  // поэтому, потом я меняю логическое значение
  let renkoChart = getRenkoChart(JSON.parse(JSON.stringify(minMaxArr)).reverse(), settings.renkoGrow)
  renkoChart = renkoChart.map(i => !i);
  renkoChart.reverse();

  let templateArr = settings.renkoArr
  if (renkoChart.length < templateArr.length) return false
  const checkArr = renkoChart.splice(0 - templateArr.length)
  const flag = checkArr.every((i, index) => {
    return !!i === !!templateArr[index]
  })
  return flag
}

module.exports = checkBuyRenko
