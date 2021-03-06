const settings = {
  stepTime: 60 * 60 * 24 * 2,
  currMoment: 1262304000, //01-01-2010
  // currMoment: 1546293600, //01-01-2019
  // currMoment: 1420070400, //01-01-2015
  // currMoment: 1567296000, //03-09-2019
  // currMoment: 1104762600,
  maxLowPeriod: 26 * 7,
  minPriceStock: 3,
  checkBuyBottom: 0,
  checkBuyTop: 1.3,
  checkSellBottom: 0.1,
  middle: 0.5,
  buyCount: 5,
  topMiddle: 1.02,
  checkSellTop: 1.05,
  maxCoef: 3,
  topBuyCount: 0,
  fix: 0.2,
  fixSum: 200000,
  addition: 500,
  additionPeriod: 180,
  withDividends: false,
  partPrice: 250,
  maxLengthPortfolio: 15,
  icrementPortfolio: false,
  curCash: 15000,
  full_history: true,
  renkoGrow: 30,
  // sellRenkoArr10-1: [1, 1, 1],
  // sellRenkoArr: [1,1],
  renkoArr: [1],
  // renkoArr: [0,1,1],
  minVolatility: 0,
  maxVolatility: 200,
}

module.exports = settings
