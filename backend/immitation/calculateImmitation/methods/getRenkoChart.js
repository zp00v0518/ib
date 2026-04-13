function getRenkoChart(target, persent = 10) {
  // постройка графика идет задом-наперед, т.е, начинается сегодня и уходит в прошлое
  // поэтому, потом я меняю логическое значение
  const arr = JSON.parse(JSON.stringify(target)).reverse()
  let step = (arr[0] / 100) * persent
  let result = []
  let lastValue = arr[0]
  arr.forEach((i) => {
    const dif = i - lastValue
    if (Math.abs(dif) > step) {
      const flag = dif > 0
      result.push(flag)
      lastValue = i
      step = (i / 100) * persent
    }
  })
  result = result.map(i => !i);
  result.reverse();
  return result
}

module.exports = getRenkoChart
