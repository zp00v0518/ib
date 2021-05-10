const InsertDB = require('../backend/db/InsertDB');
const ConnectMongoDB = require('../backend/db/connectMongoDB.js');
const mongo = new ConnectMongoDB();

async function saveResultToDB(arr = []) {
  const insertMethod = new InsertDB(mongo);
  await insertMethod.connect('ib');
  const collectionName = 'data'
  await insertMethod.many(collectionName, arr);
  await insertMethod.close();
}
module.exports = saveResultToDB;