const handlerTraidingRequest = require('../traiding/handlerTraidingRequest')
const handlerGetImmitationRequest = require('../immitation/handlerGetImmitationRequest')
const handlerGetHistoryTableRequest = require('../history/handlerGetHistoryTableRequest')

const handlers = {
  '/traiding': handlerTraidingRequest,
  '/getImmitation': handlerGetImmitationRequest,
  '/getHistoryTable': handlerGetHistoryTableRequest,
}

module.exports = handlers
