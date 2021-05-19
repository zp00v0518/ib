const settings = {
  stepTime: 60 * 60 * 24 * 2,
  currMoment: 1262304000, //01-01-2010
  // currMoment: 1567296000, //03-09-2019
  // currMoment: 1104762600,
  maxLowPeriod: 13 * 7,
  middle: 0.5,
  minPriceStock: 0.3,
  checkBuyBottom: 0.5,
  checkBuyTop: 3,
  checkSellBottom: 0.05,
  checkSellTop: 1.05,
  fix: 0.3,
  buyCount: 2,
  addition: 500,
  additionPeriod: 180,
  withDividends: false,
  partPrice: 0,
  maxLengthPortfolio: 19,
  icrementPortfolio: true,
  curCash: 3000,
}

module.exports = settings
