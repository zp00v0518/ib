const getPeriodRequest = require('./getPeriodRequest')
const getMomentResponse = require('./getMomentResponse')

async function handlerTraidingRequest(payload) {
  const { type, data } = payload;
  const { period, moment } = data;
  let periodResult = {}
  let momentResult = {}
  periodResult = await getPeriodRequest(period)
  momentResult = await getMomentResponse(moment)
  const message = {
    type,
    period: periodResult,
    moment: momentResult,
  }
  return message
}

module.exports = handlerTraidingRequest
