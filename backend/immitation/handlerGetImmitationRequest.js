const { getAllSplitData } = require('./db')
const { saveHistoryInDB } = require('../history/db')
const calculateImmitation = require('./calculateImmitation')
let settings = require('../../config/settings')
const { ObjectID } = require('bson')

const stockData = {}
async function handlerGetImmitationRequest(requestData) {
  const { type, data } = requestData
  settings = Object.assign(settings, data)
  const message = {
    type,
    data: settings,
  }
  console.time('Запрос')
  const allData = await getAllSplitData(settings)
  console.timeEnd('Запрос')
  const arr = {}
  allData.forEach((item) => {
    const timestamp = item.timestamp
    delete item._id
    delete item.timestamp
    stockData[timestamp] = item
  })
  for (let i = 0; i < 5000; i++) {
    const ops = Object.assign({}, settings)
    const history = calculateImmitation(stockData, ops)
    const z = Object.assign({}, history)
    delete z.list
    delete z.data
    const key = Math.floor(history.cost + history.fixed)
    arr[key] = z
    // arr.push(Math.floor(history.cost + history.fixed))
    await saveHistoryInDB(history)
  }
  console.log('end imitation')
  console.log(arr)
  return message
}

module.exports = handlerGetImmitationRequest
