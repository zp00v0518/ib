const settings = {
  stepTime: 60 * 60 * 24 * 2,
  // currMoment: 1262304000, //01-01-2010
  // currMoment: 1546293600, //01-01-2019
  currMoment: 1420070400, //01-01-2015
  // currMoment: 1567296000, //03-09-2019
  // currMoment: 1104762600,
  maxLowPeriod: 13 * 7,
  minPriceStock: 0.3,
  checkBuyBottom: 0.7,
  checkBuyTop: 3,
  checkSellBottom: 0.1,
  middle: 0.5,
  buyCount: 10,
  topMiddle: 1.1,
  checkSellTop: 1.15,
  topBuyCount: 1,
  fix: 0.1,
  addition: 500,
  additionPeriod: 180,
  withDividends: true,
  partPrice: 0,
  maxLengthPortfolio: 20,
  icrementPortfolio: true,
  curCash: 3000,
  full_history: true,
  renkoGrow: 10,
}

module.exports = settings
