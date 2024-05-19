// const getStocksByBasePeriod = require('./getStocksByBasePeriod')
const getAllStocks = require('./getAllStocks')
const handlerGetImmitationRequest = require('../backend/immitation/handlerGetImmitationRequest');
const sp500AllYear = require('../parser/fromFile/s&p500_by_year.json')


setTimeout(() => {
	// getAllStocks();
	handlerGetImmitationRequest({ type: '', data: {}, sp500AllYear })
}, 1000);