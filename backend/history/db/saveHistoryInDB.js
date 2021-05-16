const UpdateDB = require('../../db/UpdateDB')
// const InsertDB = require('../../db/InsertDB');
const ConnectMongoDB = require('../../db/connectMongoDB.js')
const config = require('../../../config')
const mongo = new ConnectMongoDB()

// async function saveHistoryInDB(history) {
//   const insertMethod = new InsertDB(mongo);
//   await insertMethod.connect('ib');
//   const collectionName = config.db.collections.history.name
//   history.created = Date.now()
//   await insertMethod.many(collectionName, [history])
//   await insertMethod.close();
// }

async function saveHistoryInDB(history) {
  const updateMethod = new UpdateDB(mongo)
  await updateMethod.connect('ib')
  const collectionName = config.db.collections.history.name
  // history.created = Date.now()
  const query = Object.assign({}, history)
  delete query.data
  const doc = {
    $push: { data: history.data },
  }
  await updateMethod.one(collectionName, query, doc, { upsert: true })
  await updateMethod.close()
}
module.exports = saveHistoryInDB
