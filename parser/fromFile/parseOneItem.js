// https://www.macrotrends.net/assets/php/stock_price_history.php?t=AAPL
const querystring = require('querystring')

async function parseOneItem(browser, symbol) {
  const page = await browser.newPage()
  let result = ''
  const query = {
    t: symbol.replace('_', '.'),
  }
  if (!symbol) return result
  const x = querystring.encode(query)
  const url = `https://www.macrotrends.net/assets/php/stock_price_history.php?${x}&${x}`
  result = await getValue(page, url)
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

    const selector = '#chartdiv'
    await page.waitForSelector(selector)
    data = await page.$eval(selector, async () => {
      try {
        console.log(dataDaily)
        console.log(window.dataDaily)
        return dataDaily
      } catch (err) {
        console.log('Проблема при обработке адреса:  ', url)
        return false
      }
    })
  } catch (err) {
    console.log(err)
  }
  return data
}

module.exports = parseOneItem
