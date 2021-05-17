const config = require('../../../config')
const findMethod = require('../../db/methods/findMethod')

async function getHistoryFromDB(ids = []) {
  const collectionName = config.db.collections.history.name
  const query = {
    _id: { $in: ids },
  }
  const result = await findMethod.all(collectionName, query)
  return result.result
}

module.exports = getHistoryFromDB
