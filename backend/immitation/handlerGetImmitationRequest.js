const { getAllSplitData } = require('./db')
const { saveHistoryInDB } = require('../history/db')
const calculateImmitation = require('./calculateImmitation')
let settings = require('../../config/settings')
const { ObjectID } = require('bson')
const config = require('../../config')
const newSettings = require('../../config/settings')
const listSettings = require('./listSettings')

const stockData = {}
async function handlerGetImmitationRequest(requestData) {
  const { type, data } = requestData
  settings = Object.assign(settings, data)
  const message = {
    type,
    data: settings,
  }
  console.time('Запрос')
  const collectionName = config.db.collections.splitMacroTrend.name
  // const collectionName = config.db.collections.splitDataUSA.name
  const allData = await getAllSplitData(settings, collectionName)
  console.timeEnd('Запрос')
  const arr = {}
  allData.forEach((item) => {
    const timestamp = item.timestamp
    delete item._id
    delete item.timestamp
    delete item.date
    stockData[timestamp] = item
  })
  for (let i = 0; i < 111; i++) {
    console.log('count: ', i)
    // delete require.cache[require.resolve('../../config/settings')]
    // const newSettings = require('../../config/settings')
    // let ops = Object.assign({}, newSettings)
    let ops = newSettings
    if (listSettings[i]) {
      ops = Object.assign(ops, listSettings[i])
    }
    const history = calculateImmitation(stockData, ops, i)
    const z = Object.assign({}, history)
    delete z.list
    delete z.data
    const key = Math.floor(history.cost + history.fixed)
    arr[key] = z
    delete history.sellCoefList
    delete history.annualYield
    // arr.push(Math.floor(history.cost + history.fixed))
    await saveHistoryInDB(history)
  }
  console.log('end imitation')
  console.log(arr)
  return message
}

module.exports = handlerGetImmitationRequest
