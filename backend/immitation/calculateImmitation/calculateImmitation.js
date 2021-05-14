const Stock  =require('./Stock');
const time  = require('../../../config').time

function calculateImmitation(allData, settings) {
  const { maxLowPeriod, stepTime } = settings
  settings.currMoment = settings.currMoment + stepTime;
	let allStocks = {}
  Object.keys(allData).forEach((timestamp) => {
    // const momentData = allData[timestamp];
    const start = settings.currMoment
    const end = start - maxLowPeriod * time.week;
    const dataByPeriod = getDataByPeriod([end, start], allData)
		setStoksToList(dataByPeriod, allStocks, settings);
		const candidateToBy = getCandidateToBuy(allStocks);

    settings.currMoment += stepTime
  })
}
function getDataByPeriod(range, data) {
  const times = Object.keys(data)
    .map((i) => +i)
    .sort((a, b) => a - b)
  let endIndex = times.indexOf(range[0])
  endIndex = endIndex === -1 ? 0 : endIndex
  const startIndex = times.indexOf(range[1])
  const needs = times.splice(endIndex, startIndex)
  const result = {}
  needs.forEach((timestamp) => {
    result[timestamp] = data[timestamp]
  })
  return result
}

function getCandidateToBuy(allStocks) {
	const candidateToBy = []
	Object.keys(allStocks).forEach((symbol) => {
		const stock = allStocks[symbol]
		if (stock.checkToBuy()) {
			this.candidateToBy.push(item)
		}
	})
	// const listUse = Object.keys(portfolio.list)
	// this.candidateToBy = this.candidateToBy.filter(
	// 	(i) => !listUse.includes(i.symbol)
	// )
	return candidateToBy
};

function setStoksToList(dataByPeriod, allStocks, settings){
	Object.keys(dataByPeriod).forEach(timestamp => {
		const moment = dataByPeriod[timestamp];
		Object.keys(moment).forEach(symbol => {
			if(allStocks[symbol]){
				return;
			}
			const item = new Stock(symbol, settings);
			item.addData(moment[symbol]);
			allStocks[symbol] = item
		})
	})
	return allStocks
};
module.exports = calculateImmitation
