const UpdateDB = require('../../db/UpdateDB')
// const FindInDB = require('../../db/FindInDB')
const InsertDB = require('../../db/InsertDB')
const ConnectMongoDB = require('../../db/connectMongoDB.js')
const config = require('../../../config')
// const { ObjectID } = require('bson')
const mongo = new ConnectMongoDB()
const collectionName = config.db.collections.history.name
const dbName = config.db.name

async function saveHistoryInDB(history) {
  // const updateMethod = new UpdateDB(mongo)
  // await updateMethod.connect(dbName)
  const query = Object.assign({}, history)
  delete query.data
  delete query.addCount
  delete query.partPrice
  delete query.dividends
  delete query.itog
  delete query.fixed
  delete query.cost
  const insertMethod = new InsertDB(mongo)
  await insertMethod.connect(dbName)
  history.class = 'history'
  let x
  try {
    x = await insertMethod.one(collectionName, history)
  } catch (err) {
    console.log(err)
  }
  await insertMethod.close()
  if (x) {
    const saveHistory = x.ops[0]
    await updateSettings(saveHistory._id, query)
  }
}

async function updateSettings(historyId, query) {
  const updateMethod = new UpdateDB(mongo)
  await updateMethod.connect(dbName)
  query.class = 'settings'
  const doc = {
    $addToSet: { list: historyId },
  }
  const result = await updateMethod.one(collectionName, query, doc, {
    upsert: true,
  })
  await updateMethod.close()
  return result
}

module.exports = saveHistoryInDB
