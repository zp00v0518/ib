const portfolio = {
  state: {
    curCash: 0,
    list: {},
    cost: 0,
    dividends: 0,
    fixed: 0,
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
      const isStock = state.list[stock.symbol]
      if (isStock) {
        // докупаю акции и устанавливаю среднюю цену
        const prevCost = isStock.qty * isStock.buyPrice
        isStock.qty += qty
        const middle = (stock.price * qty + prevCost) / isStock.qty
        isStock.buyPrice = middle
        isStock.buyCount++
        return
      }
      state.list[stock.symbol] = {
        stock,
        qty,
        buyPrice: stock.price,
        dateBuy: stock.timestamp,
        buyCount: 0,
      }
      return 123
    },
    SET_COST_PORTFOLIO(state) {
      const { list } = state
      const sums = Object.keys(list).map((symbol) => {
        const item = list[symbol]
        if (!item.stock.price) return 0 
        const cost = item.stock.price * item.qty
        item.cost = cost
        item.change = +(item.stock.price / item.buyPrice).toFixed(2)
        if (+item.change >= 1) {
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
    ADD_FIXED(state, value) {
      state.fixed += value
    },
  },
  actions: {
    BUY_STOCK(ctx, { stock, sum }) {
      const qty = Math.floor(sum / stock.price)
      if (Number.isNaN(qty)) return
      const purchase = qty * stock.price
      ctx.commit('ADD_STOCK_TO_PORTFOLIO', { stock, qty })
      ctx.commit('REDUCE_CURCASH', purchase)
      ctx.commit('SET_COST_PORTFOLIO')
    },
    SELL_STOCK(ctx, { item, settings }) {
      const sellPrice =
        item.change > 1.2 ? item.buyPrice * 1.2 : item.stock.price
      const sum = item.qty * sellPrice
      // console.log(`ПРОДАЖА: ${item.stock.symbol}  price: ${sellPrice.toFixed(2)}  buyPrice: ${item.buyPrice.toFixed(2)}  qty: ${item.qty} sum: ${sum.toFixed(2)}`)
      let x = 0
      if (settings.fix) {
        if (+item.change >= settings.checkSellTop) {
          const coef = (settings.checkSellTop - 1) * settings.fix
          x = sum * coef
          ctx.commit('ADD_FIXED', x)
        }
      }
      ctx.commit('ADD_TO_CURCASH', sum)
      ctx.commit('REMOVE_STOCK_FROM_PORTFOLIO', item.stock.symbol)
    },
  },
}

export default portfolio
