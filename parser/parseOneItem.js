// const url =
// "https://query1.finance.yahoo.com/v8/finance/chart/AAPL?symbol=AAPL&period1=1310936400&period2=1620317115&useYfid=true&interval=1d&includePrePost=true&events=div%7Csplit%7Cearn";
const querystring = require("querystring");

async function parseOneItem(page, symbol) {
  let stepDays = 60 * 60 * 24 * 728;
  let endPeriod = new Date("2021-05-06").getTime() / 1000;
  // const pastPeriod = new Date("2010-01-01").getTime() / 1000;
  const pastPeriod = new Date("2005-01-01").getTime() / 1000;
  const query = {
    symbol,
    period1: endPeriod - stepDays,
    period2: endPeriod,
    useYfid: true,
    interval: "1d",
    // interval: "1h",
    includePrePost: true,
    events: "div%7Csplit%7Cearn",
  };
  const loop = new Set([1, 2]);
  const result = {
    data: new Array(),
    symbol,
    period: {
      start: query.period1,
      end: query.period2,
    },
  };
  for (const count of loop) {
    const x = querystring.encode(query);
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?${x}`;
    const value = await getValue(page, url);
    if (!value.chart.result) {
      await page.close();
      return result;
    }
    const saveItem = value.chart.result[0];
    saveItem.range = {
      start: query.period1,
      end: query.period2,
      interval: query.interval,
    };
    result.data.push(saveItem);
    query.period2 = query.period1;
    query.period1 = pastPeriod;
    query.interval = "1d";
  }
  await page.close();
  result.period.start = query.period1;
  return result;
}

async function getValue(page, url) {
  await page.goto(url, {
    waitUntil: "networkidle2",
    timeout: 30000,
  });
  const element = await page.$("pre");
  const text = await page.evaluate((el) => el.textContent, element);
  let data = "";
  try {
    data = JSON.parse(text);
  } catch (err) {
    console.log(err);
  }
  return data;
}

module.exports = parseOneItem;
