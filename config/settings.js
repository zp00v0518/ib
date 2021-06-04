const settings = {
  stepTime: 60 * 60 * 24 * 2,
  currMoment: 1262304000, //01-01-2010
  // currMoment: 1546293600, //01-01-2019
  // currMoment: 1420070400, //01-01-2015
  // currMoment: 1567296000, //03-09-2019
  // currMoment: 1104762600,
  maxLowPeriod: 13 * 7,
  minPriceStock: 0.3,
  checkBuyBottom: 0,
  checkBuyTop: 1.5,
  checkSellBottom: 0.1,
  middle: 0.5,
  buyCount: 5,
  topMiddle: 1.05,
  checkSellTop: 1.15,
  maxCoef: 1.3,
  topBuyCount: 0,
  fix: 0.2,
  addition: 1000,
  additionPeriod: 180,
  withDividends: true,
  partPrice: 0,
  maxLengthPortfolio: 20,
  icrementPortfolio: true,
  curCash: 100000,
  full_history: true,
  renkoGrow: 7,
  // renkoArr10-1: [0, 1, 1],
  // sellRenkoArr10-1: [1, 1, 1],
  // sellRenkoArr: [1,1],
  renkoArr: [0,1,1],
  // renkoArr7-1: [0,1,1],
}

module.exports = settings
