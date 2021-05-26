// const getStocksByBasePeriod = require('./getStocksByBasePeriod')
const getAllStocks = require('./getAllStocks')
const handlerGetImmitationRequest = require('../backend/immitation/handlerGetImmitationRequest')


setTimeout(() => {
	// getAllStocks();
	handlerGetImmitationRequest({ type: '', data: {} })
}, 1000);