const { getSettingsFormDB } = require('../db')

async function handlerGetHistoryBlock(data) {
  const { type, id } = data
  const message = {
    type,
    result: [],
  }
  const hist = await getSettingsFormDB(id)
  message.result = hist[0]
  return message
}


module.exports = handlerGetHistoryBlock
