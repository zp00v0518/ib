import { ObjectID } from 'bson'

const history = {
  state: {
    table: [],
    settings: {},
    history:{}
  },
  mutations: {
    SET_TABLE(state, arr) {
      state.table = arr
    },
    ADD_SETTINGS_ELEM(state, payload) {
      const { id, data } = payload
      state.settings[id] = data
    },
    ADD_HISTORY_ELEM(state, payload){
      const { id, data } = payload
      state.history[id] = data
    }
  },
  // getters: {
  //   getHistoryElem: (state) => (id) => {
  //     const { settings } = state
  //     const elem = null
  //     Object.keys(settings).forEach((key) => {
  //       const item = settings[key]
  //       const index = item.list.findIndex((i) => i === id)
  //       if (index === -1) return
  //       elem = item.data[index]
  //     })
  //     return elem
  //   },
  // },
}

export default history
