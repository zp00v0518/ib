const { getSymbolsFromPeriod } = require('./db')
const config = require('../../config');

async function getPeriodRequest(period) {
  const { range, symbols } = period
  if (!Array.isArray(range)) {
    console.log('getPeriodRequest: range must be array')
    return
  }
  if (range.length !== 2) {
    console.log('getPeriodRequest: range length must be 2')
    return
  }
  const colectionName = config.db.collections.splitDataUSA.name
  const result = await getSymbolsFromPeriod(colectionName, range, symbols);
  return result.result
}

module.exports = getPeriodRequest
