const settings = {
  stepTime: 60 * 60 * 24 * 2,
  // currMoment: 1262304000, //01-01-2010
  // currMoment: 1546293600, //01-01-2019
  // currMoment: 1420070400, //01-01-2015
  // currMoment: 1567296000, //03-09-2019
  currMoment: 1104762600, //03-01-2005
  maxLowPeriod: 26 * 7,
  minPriceStock: 1,
  checkBuyBottom: 0.8, // чем ближе к единице тем, будет ближе цена покупки к минимальной цене за период.
  checkBuyTop: 1.2, // чем ближе к единице тем, будет ближе цена покупки к максимальной  цене за период.
  checkSellBottom: 0.1,
  middle: 0.5,
  buyCount: 3,
  topMiddle: 1.02,
  checkSellTop: 1.05,
  maxCoef: 3,
  topBuyCount: 0,
  fix: 0,
  fixSum: 200000,
  addition: 500,
  additionPeriod: 90,
  withDividends: false,
  partPrice: 250,
  maxLengthPortfolio: 15,
  icrementPortfolio: true,
  curCash: 15000,
  full_history: true,
  renkoGrow: 10,
  // sellRenkoArr: [1,1],
  // renkoArr: [1],
  renkoArr: [0,0,1,1],
  minVolatility: 0,
  maxVolatility: 0,
}

module.exports = settings
