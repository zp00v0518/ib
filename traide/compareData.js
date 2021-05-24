function compareData(arr) {
  arr.forEach((item) => {
    const compareData = {
      timestamp: [],
      indicators: {
        quote: {
          close: [],
          high: [],
          low: [],
          open: [],
          volume: [],
        },
        adjclose: {
          adjclose: [],
        },
      },
    }
    const z = item
    if (item.symbol && item.symbol.includes('.')) {
      item.symbol = item.symbol.replace('.', '_')
    }
    item.data.forEach((dataElem) => {
      if (!dataElem.timestamp) return
      try {
        compareData.timestamp.unshift(...dataElem.timestamp)
        compareQuote(compareData.indicators.quote, dataElem.indicators.quote)
        compareAdjclose(compareData.indicators.adjclose, dataElem.indicators)
        compareEvents(compareData, dataElem)
      } catch (err) {
        console.log(err)
        console.log(item)
        console.log('**********')
      }
      item.compareData = compareData
    })
  })
  return arr
}

function compareQuote(target, quote) {
  if (quote.length > 1) {
    console.log(quote)
  }
  Object.keys(quote[0]).forEach((key) => {
    if (key.includes('.')) {
      console.log()
    }
    if (target[key] === undefined) target[key] = []
    target[key].unshift(...quote[0][key])
  })
}

function compareAdjclose(target, indicator) {
  if (!indicator.adjclose) return
  const { adjclose } = indicator
  if (adjclose.length > 1) {
    console.log(adjclose)
  }
  Object.keys(adjclose[0]).forEach((key) => {
    if (target[key] === undefined) target[key] = []
    target[key].unshift(...adjclose[0][key])
  })
}

function compareEvents(target, base) {
  if (!base.events) return
  // const baseKeys = ["splits", "dividends"];
  if (!target.events) target.events = {}
  Object.keys(base.events).forEach((key) => {
    if (!target.events[key]) target.events[key] = {}
    target.events[key] = Object.assign(target.events[key], base.events[key])
  })
}

module.exports = compareData
