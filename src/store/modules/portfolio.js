const portfolio = {
  state: {
    curCash: 1000,
    list: {},
    cost: 1000,
		maxLength: 15
  },
  mutations: {
    REDUCE_CURCASH(state, value) {
      state.curCash -= value
    },
    ADD_TO_CURCASH(state, value) {
      state.curCash += value
    },
    ADD_STOCK_TO_PORTFOLIO(state, payload) {
      const { stock, qty } = payload
      state.list[stock.symbol] = {
        stock,
        qty,
        buyPrice: stock.price,
        dateBuy: stock.timestamp
      }
    },
    SET_COST_PORTFOLIO(state) {
      const { list } = state
      const sums = Object.keys(list).map((symbol) => {
        const item = list[symbol]
        const cost = item.stock.price * item.qty
        item.cost = cost
				item.change = (item.stock.price / item.buyPrice).toFixed(2);
				if (+item.change >= 1){
					// console.log(item)
				}
        return cost
      })
      const baseCost = sums.reduce((acc, value) => {
        return (acc += value)
      }, 0)
      state.cost = baseCost + state.curCash
    },
    REMOVE_STOCK_FROM_PORTFOLIO(state, symbol) {
      delete state.list[symbol]
    },
  },
  actions: {
    BUY_STOCK(ctx, { stock, sum }) {
      const qty = Math.floor(sum / stock.price)
      const purchase = qty * stock.price;
      ctx.commit('ADD_STOCK_TO_PORTFOLIO', { stock, qty })
      ctx.commit('REDUCE_CURCASH', purchase)
      ctx.commit('SET_COST_PORTFOLIO')
    },
    SELL_STOCK(ctx, item) {
      const sum = item.qty * item.stock.price
      ctx.commit('ADD_TO_CURCASH', sum)
      ctx.commit('REMOVE_STOCK_FROM_PORTFOLIO', item.stock.symbol)
    },
  },
}

export default portfolio
