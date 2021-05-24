const settings = {
  stepTime: 60 * 60 * 24 * 2,
  // currMoment: 1262304000, //01-01-2010
  currMoment: 1420070400, //01-01-2015
  // currMoment: 1567296000, //03-09-2019
  // currMoment: 1104762600,
  maxLowPeriod: 13 * 7,
  middle: 0.5,
  minPriceStock: 0.3,
  checkBuyBottom: 0.5,
  checkBuyTop: 3,
  checkSellBottom: 0.05,
  checkSellTop: 1.05,
  fix: 0.1,
  buyCount: 3,
  addition: 100,
  additionPeriod: 180 * 4,
  withDividends: true,
  partPrice: 0,
  maxLengthPortfolio: 500,
  icrementPortfolio: true,
  curCash: 50000,
  full_history: false,
  renkoGrow: 5,
}

module.exports = settings
