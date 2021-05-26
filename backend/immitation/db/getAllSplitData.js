const findMethod = require('../../db/methods/findMethod')
const getSymbolsFromPeriod = require('../../traiding/db/getSymbolsFromPeriod')
const config = require('../../../config')
const defaultCollection = config.db.collections.splitDataUSA.name

async function getAllSplitData(settings, collectionName = defaultCollection) {
  const count = await findMethod.count(collectionName)
  const data = []
  let start = settings.currMoment
  const length = 12
  let arr = Array.from({ length })
  arr = arr.map((i, index) => index + 1)
  const x = Math.ceil(count / length)
  for (const iterator of arr) {
    const end = start + settings.stepTime * x
    const range = [start, end]
    const response = await getSymbolsFromPeriod(collectionName, range)
    if (response.result.length === 0) break
    data.push(...response.result)
    start = end
  }
  return data
}

module.exports = getAllSplitData
