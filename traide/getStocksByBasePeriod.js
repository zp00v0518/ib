const config = require('../config');
const {time} = config;
const getFindMethod = require('./getFindMethod');

async function getStocksByBasePeriod(){
  const find = await getFindMethod();
  const collectionName = config.db.collections.data.name;
	const startDate = time.startDate;
	const week26 = time.week * 26;
	const query = {
		'period.start': {$gte: startDate},
		'period.end': {$lte: startDate + week26},
	}
  const result = await find.all(collectionName, query);
	console.log(result.result);
	find.close();
}

module.exports = getStocksByBasePeriod;
	