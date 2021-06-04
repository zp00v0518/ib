// const url =
// 'https://finance.yahoo.com/quote/FAMI/history?period1=1613001600&period2=1620691200&interval=1d&filter=history&frequency=1d&includeAdjustedClose=true'
const querystring = require('querystring')
const settings = require('../../config/settings')

async function parseOneItem(page, symbol) {
  let endPeriod = Math.floor(Date.now() / 1000)
  const weekCount = settings.maxLowPeriod / 7
  const day = 60 * 60 * 24
  const stepToPast = day * settings.maxLowPeriod + day * 3 * (weekCount + 1)
  const pastPeriod = endPeriod - stepToPast
  const query = {
    symbol,
    period1: pastPeriod,
    period2: endPeriod,
    useYfid: true,
    interval: '1d',
    includePrePost: true,
    events: 'div%7Csplit%7Cearn',
  }
  const result = {
    data: new Array(),
    symbol,
    period: {
      start: query.period1,
      end: query.period2,
    },
  }
  if (!symbol) return result
  const x = querystring.encode(query)
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?${x}`
  const value = await getValue(page, url)
  if (!value || !value.chart || !value.chart.result || !value.chart.result[0]) {
    await page.close()
    return result
  }
  const saveItem = value.chart.result[0]
  saveItem.range = {
    start: query.period1,
    end: query.period2,
    interval: query.interval,
  }
  result.data.push(saveItem)
  await page.close()
  return result
}

async function getValue(page, url) {
  let data = ''
  try {
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    })
    const element = await page.$('pre')
    const text = await page.evaluate((el) => el.textContent, element)
    data = JSON.parse(text)
  } catch (err) {
    console.log(err)
    return data
  }
  return data
}

module.exports = parseOneItem
