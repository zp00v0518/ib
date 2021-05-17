const ObjectID = require('mongodb').ObjectID
const config = require('../../../config')
const findMethod = require('../../db/methods/findMethod')
const getHistoryFromDB = require('./getHistoryFromDB')

async function getSettingsFormDB(id) {
  const collectionName = config.db.collections.history.name
  let query = {
    class: 'settings',
  }
  if (id !== undefined) {
    query._id = new ObjectID(id)
  }
  const findSettings = await findMethod.all(collectionName, query)
  const settings = findSettings.result
  for (const item of settings) {
    const findHist = await getHistoryFromDB(item.list)
    item.data = []
    findHist.forEach((his) => {
      item.data.push(his)
    })
  }

  return settings
}

module.exports = getSettingsFormDB
