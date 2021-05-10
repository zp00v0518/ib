import Stock from '../../stock'

const stocks = {
  state: {
    list: {},
  },
  mutations: {
    ADD_STOCKS_TO_LIST(state, payload) {
      if (state.list[payload.symbol]) {
				state.list[payload.symbol].addData(payload.data)
        return
      }
      const item = new Stock(payload.symbol)
      item.addData(payload.data)
      state.list[payload.symbol] = item
    },
  },
}

export default stocks
