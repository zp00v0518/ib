const goodSettings = [
    {
        currMoment: 1262304000, //01-01-2010
        maxLowPeriod: 26 * 7,
        minPriceStock: 1,
        checkBuyBottom: 0.99999, // чем ближе к единице тем, будет ближе цена покупки к минимальной цене за период.
        checkBuyTop: 1.0001, // чем ближе к единице тем, будет ближе цена покупки к максимальной  цене за период.
        checkSellBottom: 0.2,
        middle: 0.7,
        buyCount: 6,
        topMiddle: 1.02,
        checkSellTop: 1.4,
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
        renkoGrow: 5,
        renkoArr: [0, 0, 1, 0, 1, 1], // not not bad
    },
    {
        stepTime: 60 * 60 * 24 * 2,
        currMoment: 1262304000, //01-01-2010
        maxLowPeriod: 26 * 7,
        minPriceStock: 1,
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
        renkoArr: [0,0,1,0,1, 1], 
    }
]