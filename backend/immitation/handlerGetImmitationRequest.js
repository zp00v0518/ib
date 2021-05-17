const { getAllSplitData } = require('./db')
const {saveHistoryInDB} = require('../history/db');
const calculateImmitation = require('./calculateImmitation')
let settings = require('../../config/settings')

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
  allData.forEach((item) => {
    const timestamp = item.timestamp
    delete item._id
    delete item.timestamp
    stockData[timestamp] = item
  })
  for (let i = 0; i < 10; i++) {
    const ops = Object.assign({}, settings)
    const history = calculateImmitation(stockData, ops)
    await saveHistoryInDB(history)
  }
  console.log('end imitation')
  return message
}

module.exports = handlerGetImmitationRequest
