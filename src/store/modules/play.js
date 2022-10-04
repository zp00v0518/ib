const play = {
  state: {
    charts: {},
  },
  mutations: {
    ADD_DATA_CHART(state, payload) {
      const { id, data } = payload
      if(!state.charts[id]) state.charts[id] = []
      state.charts[id].push(...data)
    },
    REMOVE_LAST_DATA_CHART(state, payload) {
      const { id } = payload
      if(!state.charts[id]) state.charts[id] = []
      state.charts[id].pop()
    },
    RESET_CHART_DATA(state, id) {
      state.charts[id] = []
    },
  },
}

export default play
