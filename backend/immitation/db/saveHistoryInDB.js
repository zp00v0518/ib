const InsertDB = require('../../db/InsertDB');
const ConnectMongoDB = require('../../db/connectMongoDB.js');
const config = require('../../../config')
const mongo = new ConnectMongoDB();

async function saveHistoryInDB(history) {
  const insertMethod = new InsertDB(mongo);
  await insertMethod.connect('ib');
  const collectionName = config.db.collections.history.name
  history.created = Date.now()
  await insertMethod.many(collectionName, [history])
  await insertMethod.close();
}

module.exports = saveHistoryInDB
