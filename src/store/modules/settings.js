const drawer = {
  state: {
    startMoment: 1262615400,
    stepTime: 60 * 60 * 24,
    currMoment: 1262615400,
  },
  mutations: {
    CURRMOMENT_INCREMENT(state){
      state.currMoment += state.stepTime;
    }
  },
  actions: {}
};

export default drawer;
