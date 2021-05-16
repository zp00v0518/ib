const ObjectID = require('mongodb').ObjectID;
const config = require('../../../config')
const findMethod = require('../../db/methods/findMethod')


async function getHistoryFromDB(id){
	const collectionName = config.db.collections.history.name;
	let query = {}
	if (id !== undefined){
		query = {
			_id: new ObjectID(id),
		}
	}
	const result = await findMethod.all(collectionName, query);
	return result.result;
}

module.exports = getHistoryFromDB