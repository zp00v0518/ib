const ObjectID = require('mongodb').ObjectID
const { getHistoryFromDB } = require('../db')

async function handlerGetHistoryElem(data) {
  const { type, id } = data
  const message = {
    type,
    result: [],
  }
  const hist = await getHistoryFromDB([new ObjectID(id)])
  message.result = hist[0]
  return message
}


module.exports = handlerGetHistoryElem
