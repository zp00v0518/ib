const config = require('../config');
const FindInDB = require('../backend/db/FindInDB');
const ConnectMongoDB = require('../backend/db/connectMongoDB.js');
const mongo = new ConnectMongoDB();

async function getFindMethod(){
	const find = new FindInDB(mongo);
  await find.connect(config.db.name);
	return find;
}


module.exports = getFindMethod;