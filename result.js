const startSum = 100
const persentByYear =  10
const years = 10
const addSum = 27
const addsPeriod = 'month'
// const addsPeriod = 'quater'
// const addsPeriod = 'years'


// calculateWithAdds(startSum, persentByYear, years)
// calculateWithAdds(startSum, persentByYear, years, 'quater')
// calculateWithAdds(startSum, persentByYear, years, 'month')
// calculateWithAdds(startSum, persentByYear, years, 'quater', { addSum: addSum, period: addsPeriod })
// calculateWithAdds(startSum, persentByYear, years, 'years', { addSum: addSum, period: addsPeriod })


function calculateWithAdds(startSum, persentByYear, years, reinvest = 'years', adds) {
  if (adds === undefined) {
    calculateInvest(...arguments)
    return
  }
  const steps = getNumIteration(years, reinvest)
  const cashe = [calculateInvest(...arguments)]
  let itaration = getNumIteration(years, adds.period)
  let persent = getPersent(persentByYear, adds.period)
  const addsArr = [startSum,]
  for (; itaration > 0; itaration--) {
    cashe.push(getFinalMoneySum(adds.addSum, persent, itaration))
    addsArr.push(adds.addSum)
  }
  const result = cashe.reduce((a, b) => a + b, 0)
  const addsSum = addsArr.reduce((a, b) => a + b, 0)
  printResult(result, getGrow(result, startSum), reinvest, persentByYear, steps, adds)
  console.log('Чистий прибуток: ', l(result - addsSum))
}

function calculateInvest(startSum, persentByYear, years, reinvest = 'years') {
  let persent = getPersent(persentByYear, reinvest)
  const steps = getNumIteration(years, reinvest)
  const result = getFinalMoneySum(startSum, persent, steps);
  const grow = getGrow(result, startSum)
  printResult(result, grow, reinvest, persentByYear, steps)
  return result
}

function printResult(result, grow, reinvest, persent, steps, adds) {
  let info = `persent: ${persent}      steps: ${steps}`
  if (adds) info = info + `     addSum: ${adds.addSum} by ${adds.period} `
  console.log(info)
  console.log(reinvest, ':  ', l(result), '********', l(grow) + '%');
  console.log()
}

function getNumIteration(years, period) {
  if (period === 'years') return years
  if (period === 'quater') return years * 4
  if (period === 'month') return years * 12
}
function getPersent(persentByYear, reinvest) {
  let persent = persentByYear / 100
  if (reinvest === 'years') return persent
  if (reinvest === 'quater') return persent / 4
  if (reinvest === 'month') return persent / 12
}
function getFinalMoneySum(startSum, persent, steps) {
  return Math.floor(startSum * Math.pow(1 + persent, steps))
}

function getGrow(result, startSum) {
  return (result / startSum) * 100 - 100

}



function l(value) {
  return new Intl.NumberFormat('ru-RU').format(value);
}


const f = 15000
const start = 16500
const end = 147000 - f
const period = 8
// calcHardPercent(start, end, period)
// calcHardPercent(25000, 100000, 20)

function calcHardPercent(start, end, period){
  // расчет сложного процента исходя из реальных сум, полученных на начало и конец периода
  console.log('Складний відсоток: ',(Math.pow(end / start, 1 / period) - 1) * 100)
// тоже самое, только простой процент
console.log('Загальний відсоток: ',((end/start -1)*100))
console.log('Помісячний відсоток: ', ((end/start -1)*100)/period)
}
