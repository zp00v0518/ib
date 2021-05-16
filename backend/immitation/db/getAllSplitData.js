const findMethod = require('../../db/methods/findMethod')
const getSymbolsFromPeriod = require('../../traiding/db/getSymbolsFromPeriod')
const config = require('../../../config')

async function getAllSplitData(settings) {
  const collectionName = config.db.collections.splitData2.name
  const count = await findMethod.count(collectionName)
  const data = []
  let start = settings.currMoment
  const length = 12
  let arr = Array.from({ length: 6 })
  arr = arr.map((i, index) => index + 1)
  const x = Math.ceil(count / length)
  for (const iterator of arr) {
    const end = start + settings.stepTime * x
    const range = [start, end]
    const response = await getSymbolsFromPeriod(range)
    data.push(...response.result)
    start = end
  }
  return data
}

module.exports = getAllSplitData
