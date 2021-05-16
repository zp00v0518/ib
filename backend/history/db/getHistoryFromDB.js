const config = require('../../../config')
const findMethod = require('../../db/methods/findMethod')

async function getHistoryFromDB(){
	const collectionName = config.db.collections.history.name;
	const needFields = {
		// data: 0,
	}
	const result = await findMethod.all(collectionName, {}, {needFields});
	return result.result;
}

module.exports = getHistoryFromDB