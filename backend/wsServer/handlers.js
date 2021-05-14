const handlerTraidingRequest = require('../traiding/handlerTraidingRequest')
const handlerGetImmitationRequest = require('../immitation/handlerGetImmitationRequest')

const handlers = {
  '/traiding': handlerTraidingRequest,
  '/getImmitation': handlerGetImmitationRequest,
}

module.exports = handlers
