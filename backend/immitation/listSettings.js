const listSettings = {
  100: {
    checkBuyBottom: 0,
    checkBuyTop: 0,
  },
  200: {
    checkBuyBottom: 0.8,
    checkBuyTop: 1.3,
    checkSellTop: 1.1,
  },
  300: {
    checkSellTop: 1.2,
  },
  400: {
    checkSellTop: 1.3,
  },
  500: {
    checkSellTop: 1.4,
  },
  600: {
    checkSellTop: 1.1,
    renkoArr: [1],
  },
  700: {
    renkoGrow: 5,
  },
  800: {
    checkBuyTop: 1.1,
    checkBuyBottom: 0.9,
  },
  900: {
    renkoArr: [1, 1],
  },
  1000: {
    minPriceStock: 0.3,
    checkBuyBottom: 0.8,
    checkBuyTop: 1.4,
    checkSellBottom: 0.1,
    middle: 0.5,
    buyCount: 5,
    topMiddle: 1.05,
    checkSellTop: 1.1,
    maxCoef: 6,
    topBuyCount: 0,
    fix: 0.2,
    fixSum: 200000,
    addition: 500,
    additionPeriod: 180,
    withDividends: true,
    partPrice: 0,
    maxLengthPortfolio: 20,
    icrementPortfolio: true,
    curCash: 10000,
    full_history: true,
    renkoGrow: 7,
    maxLowPeriod: 26 * 7,
  },
}

module.exports = listSettings
