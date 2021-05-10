const portfolio = {
  state: {
    curCash: 1000,
    list: {},
    cost: 1000,
  },
  mutations: {
    REDUCE_CURCASH(state, value) {
      state.curCash -= value
    },
    ADD_STOCK_TO_PORTFOLIO(state, payload) {
      const { stock, qty } = payload
      state.list[stock.symbol] = {
        stock,
        qty,
        buyPrice: stock.price,
      }
    },
    SET_COST_PORTFOLIO(state) {
      const { list } = state
      const sums = Object.keys(list).map((symbol) => {
        const item = list[symbol]
        const cost = item.stock.price * item.qty
        item.cost = cost
        return cost
      })
      state.cost = sums.reduce((acc, value) => {
        return (acc += value)
      }, 0);
			console.log(list)
    },
  },
  actions: {
    BUY_STOCK(ctx, { stock, sum }) {
      const qty = Math.floor(sum / stock.price)
      const purchase = qty * stock.price
      ctx.commit('ADD_STOCK_TO_PORTFOLIO', { stock, qty })
      ctx.commit('REDUCE_CURCASH', purchase)
      ctx.commit('SET_COST_PORTFOLIO')
    },
  },
}

export default portfolio
