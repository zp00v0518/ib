const getStocksByBasePeriod = require('./getStocksByBasePeriod')
const getAllStocks = require('./getAllStocks')
const handlerGetImmitationRequest = require('../backend/immitation/handlerGetImmitationRequest')

// getAllStocks();

setTimeout(() => {
	handlerGetImmitationRequest({ type: '', data: {} })
}, 1000);