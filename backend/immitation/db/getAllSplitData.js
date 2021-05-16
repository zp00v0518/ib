const findMethod = require('../../db/methods/findMethod')
const getSymbolsFromPeriod = require('../../traiding/db/getSymbolsFromPeriod')
const config = require('../../../config')
const startMoment = 1262615400
const stepTime = 60 * 60 * 24

async function getAllSplitData() {
  const collectionName = config.db.collections.splitData2.name
  const count = await findMethod.count(collectionName)
  const data = []
  let start = startMoment
  const length = 12
  let arr = Array.from({ length: 1 });
	arr = arr.map((i,index)=> index+1);
	const x = Math.ceil(count / length);
	// const x = Math.floor(count / length / 5);
  for (const iterator of arr) {
		const end = start + stepTime * x
    const range = [start, end]
    const response = await getSymbolsFromPeriod(range)
    data.push(...response.result);
		start = end;
  }
	return data
}

module.exports = getAllSplitData
