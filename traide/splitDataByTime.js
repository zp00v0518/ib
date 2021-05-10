function splitDataByTime(arr) {
  const result = {};
  arr.forEach((item) => {
    const compareData = item.compareData;
		if(!compareData) return;
    const meta = item.data[0].meta;
    const { symbol } = meta;
    const { timestamp, indicators, events } = compareData;
    timestamp.forEach((timeValue, index) => {
      if (!result[timeValue]) result[timeValue] = {};
      result[timeValue][symbol] = {
        timestamp: timeValue,
        index,
        ...symbolTemplate(indicators, index),
      };
      if (events) {
        const templateEv = eventsTemplate(events, timeValue);
        result[timeValue][symbol] = Object.assign(result[timeValue][symbol],templateEv);
      }
    });
  });
  return result;
}
function symbolTemplate(indicators, index) {
  const el = {};
  const { adjclose, quote } = indicators;
  el.adjclose = adjclose[index];
  el.close = quote.close[index];
  el.low = quote.low[index];
  el.open = quote.open[index];
  el.volume = quote.volume[index];
  return el;
}

function eventsTemplate(events, timeValue) {
  const el = {};
  const { splits, dividends } = events;
  if (splits && splits[timeValue]) {
    el.splits = splits[timeValue];
  }
	if (dividends && dividends[timeValue]) {
    el.dividends = dividends[timeValue];
  }
  return el;
}


module.exports = splitDataByTime;
