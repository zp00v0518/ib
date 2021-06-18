// https://www.nexus.ua/standartnoe-otklonenie-standard-deviation
// https://ru.m.wikipedia.org/wiki/%D0%92%D0%BE%D0%BB%D0%B0%D1%82%D0%B8%D0%BB%D1%8C%D0%BD%D0%BE%D1%81%D1%82%D1%8C#%D0%A0%D0%B0%D1%81%D1%87%D1%91%D1%82_%D0%B8%D1%81%D1%82%D0%BE%D1%80%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%BE%D0%B9_%D0%B2%D0%BE%D0%BB%D0%B0%D1%82%D0%B8%D0%BB%D1%8C%D0%BD%D0%BE%D1%81%D1%82%D0%B8

function checkVolatility(nums) {
  const avg = getAverage(nums)
  const newArr = nums.map((i) => (i - avg) ** 2) // возведение в степень
  const newSum = getSumArr(newArr)
  const standardDeviation = Math.sqrt(newSum / newArr.length - 1)
  const time = Math.sqrt(365 / nums.length)
  return standardDeviation / time * 100
}

function getSumArr(nums) {
  return nums.reduce((a, b) => a + b)
}

function getAverage(nums) {
  return getSumArr(nums) / nums.length
}
module.exports = checkVolatility
