const { getHistoryFromDB } = require('./db')

async function handlerGetHistoryTableRequest(data) {
  const { type } = data
  const message = {
    type,
    result: [],
  }
  const hist = await getHistoryFromDB()
  setMinMax(hist)
  message.result = hist
  return message
}

function setMinMax(arr) {
  arr.forEach((item) => {
    const data = item.data
    delete item.data
		const values = []
    data.forEach((obj) => {
      const keys = Object.keys(obj)
      const lastItemKey = keys[keys.length - 1]
      values.push(obj[lastItemKey].cost)
    })
    item.maxCost = Math.max(...values)
    item.minCost = Math.min(...values)
  })
}

module.exports = handlerGetHistoryTableRequest
