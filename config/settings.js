const settings = {
  stepTime: 60 * 60 * 24 * 2,
  // currMoment: 1262304000, //01-01-2010
  currMoment: 1420070400, //01-01-2015
  // currMoment: 1567296000, //03-09-2019
  // currMoment: 1104762600,
  maxLowPeriod: 13 * 7,
  middle: 0.6,
  minPriceStock: 0.3,
  checkBuyBottom: 0.7,
  checkBuyTop: 3,
  checkSellBottom: 0.1,
  checkSellTop: 1.2,
  fix: 0.1,
  buyCount: 3,
  addition: 100,
  additionPeriod: 180 * 4,
  withDividends: true,
  partPrice: 0,
  maxLengthPortfolio: 70,
  icrementPortfolio: true,
  curCash: 7000,
  full_history: false,
  renkoGrow: 10,
}

module.exports = settings
