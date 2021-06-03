function getRenkoChart(arr, persent = 10) {
  let step = (arr[0] / 100) * persent
  const result = []
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
  return result
}

module.exports = getRenkoChart
