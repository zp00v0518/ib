const handlerTraidingRequest = require('../traiding/handlerTraidingRequest')
const handlerGetImmitationRequest = require('../immitation/handlerGetImmitationRequest')
const history = require('../history/wsHandlers')

const handlers = {
  '/traiding': handlerTraidingRequest,
  '/getImmitation': handlerGetImmitationRequest,
  '/getHistoryTable': history.handlerGetHistoryTableRequest,
  '/getHistoryBlock': history.handlerGetHistoryBlock,
}

module.exports = handlers
