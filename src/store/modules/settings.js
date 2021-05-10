import { time } from '../../utils'

const settings = {
  state: {
    startMoment: 1262615400,
    stepTime: 60 * 60 * 24,
    currMoment: 1262615400,
    maxLowPeriod: time.week * 26,
    startCash: 1000,
  },
  mutations: {
    CURRMOMENT_INCREMENT(state) {
      state.currMoment += state.stepTime
    },
  },
  actions: {},
}

export default settings
