const settings = {
  stepTime: 60 * 60 * 24 * 2,
  currMoment: 1262304000, //01-01-2010
  // currMoment: 1293840000, //01-01-2011
  // currMoment: 1546293600, //01-01-2019
  // currMoment: 1420070400, //01-01-2015
  // currMoment: 1567296000, //03-09-2019
  // currMoment: 1104762600, //03-01-2005
  maxLowPeriod: 26 * 7,
  minPriceStock: 10,
  checkBuyBottom: 0.99999, // чем ближе к единице тем, будет ближе цена покупки к минимальной цене за период.
  checkBuyTop: 1.0001, // чем ближе к единице тем, будет ближе цена покупки к максимальной  цене за период.
  checkSellBottom: 0.2,
  middle: 0.7,
  buyCount: 5,
  topMiddle: 1.1,
  checkSellTop: 1.4,
  maxCoef: 3,
  topBuyCount: 1,
  fix: 0,
  fixSum: 200000,
  addition: 500,
  additionPeriod: 31,
  withDividends: false,
  partPrice: 250,
  maxLengthPortfolio: 15,
  icrementPortfolio: true,
  curCash: 10000,
  full_history: true,
  renkoGrow: 5,
  // sellRenkoArr: [1,1,1],
  renkoArr: [0,0,1,0,1, 1], // not not bad
  // renkoArr: [0,1,0,1, 1], // not not bad- 
  // renkoArr: [0,0,1,0,1, 1], // not not bad
  // renkoArr: [0,0,1,1,0,1, 1, 1], // not bad
  // renkoArr: [1, 1, 1],
  minVolatility: 0,
  maxVolatility: 0,
  sp500Mode: true, 
}

module.exports = settings
