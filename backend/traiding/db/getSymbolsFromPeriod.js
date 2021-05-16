const config = require('../../../config')
const { findMethod } = require('../../db/methods')

async function getSymbolsFromPeriod(range, symbols = []) {
  const collectionName = config.db.collections.splitData2.name
  // const collectionName = config.db.collections.splitByTime.name
  const start = range[0]
  const end = range[1]
  const query = {
    $and: [{ timestamp: { $gte: start } }, { timestamp: { $lte: end } }],
  }
	let needFields = null;
	if (symbols.length > 0){
		needFields = {
			timestamp: 1,
			_id: 0
		};
		symbols.forEach(item => {
			needFields[item] = 1;
		})
	}
	const result = await findMethod.all(collectionName, query, {needFields});
	return result;
}

module.exports = getSymbolsFromPeriod
