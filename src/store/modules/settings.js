const settings = {
  state: {
    stepTime: 60 * 60 * 24,
    currMoment: 1104762600,
    // currMoment: 1262615400,
    maxLowPeriod: 13,
    partPrice: 0,
    middle: 0.5,
    minPriceStock: 0.3,
    checkBuyBottom: 0.5,
    checkBuyTop: 3,
    checkSellBottom: 0.05,
    checkSellTop: 1.05,
    maxLengthPortfolio: 20,
    curCash: 3000,
    fix: 0.3,
    buyCount: 2,
  },
  mutations: {
    SET_PARTPRICE(state, value) {
      state.partPrice = value
    },
    CURRMOMENT_INCREMENT(state) {
      state.currMoment += state.stepTime
    },
    SET_SETTING(state, { field, value }) {
      state[field] = value
    },
  },
  actions: {
    SET_SETTINGS(ctx, fields) {
      fields.forEach((item) => {
        if (item.code === 'curCash') {
          ctx.commit('ADD_TO_CURCASH', +item.value)
          return
        }
        ctx.commit('SET_SETTING', {
          field: item.code,
          value: +item.value,
        })
      })
    },
  },
}

export default settings
