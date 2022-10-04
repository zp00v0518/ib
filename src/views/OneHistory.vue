<template>
  <div class="history_chart" v-if="isReady">
    <div class="history_chart__btns">
      <button @click="goPlay">{{ isGo ? 'Pause' : 'Play' }}</button>
      <button @click="previousStep" :disabled="isGo">Previous Step</button>
      <button @click="nextStep" :disabled="isGo">Next Step</button>
    </div>
    <div class="history_chart_body">
      <HistoryChart
        :data="history"
        :id="$route.params.id"
        local
        class="history_chart_body__item"
      ></HistoryChart>
      <PlayPortfolio
        ref="playComponent"
        :data="history"
        :isGo="isGo"
        @reset="handlerReset"
        @end-play="isGo = false"
        class="history_chart_body__item"
      ></PlayPortfolio>
    </div>
  </div>
</template>

<script>
import HistoryChart from '../components/HistoryChart'
import PlayPortfolio from '../components/PlayPortfolio'

export default {
  name: 'OneHistory',
  components: { HistoryChart, PlayPortfolio },
  created() {
    this.getData()
    document.addEventListener('keyup', this.goPlay)
  },
  beforeUnmount(){
    document.removeEventListener('keyup', this.goPlay)
  },
  data() {
    return {
      history: [],
      isReady: false,
      isGo: false,
    }
  },
  computed: {
    saveHistory() {
      return this.$store.state.history.history
    },
  },
  methods: {
    nextStep(){
      this.$refs.playComponent.nextStep()
    },
    previousStep(){
      this.$refs.playComponent.previousStep()
    },
    goPlay(e){
      if (e.type === "keyup" && e.code !== 'Space') return
      this.isGo = !this.isGo
    },
    async getData() {
      const id = this.$route.params.id
      if (this.saveHistory[id]) {
        this.init(this.saveHistory[id])
        return
      }
      const message = {
        type: '/getHistoryElem',
        id,
      }
      try {
        console.log('OneHistory sendrequest')
        const response = await this.$api.get(message)
        this.init(response.result)
      } catch (err) {
        setTimeout(() => {
          this.getData()
        }, 200)
      }
    },
    init(ev) {
      this.history = ev.data
      this.isReady = true
      const payload = {
        id: ev._id,
        data: ev,
      }
      this.$store.commit('ADD_HISTORY_ELEM', payload)
    },
  },
}
</script>

<style lang="scss">
.history_chart {
  padding: 24px;
  .history-elem__item {
    width: 100%;
  }
  &_body {
    display: flex;
    flex-wrap: wrap;
    .history-elem__item {
      width: 40%;
      min-width: 800px;
      // flex-grow: unset;
    }
    .play {
      width: 40%;
      // flex-grow: 2;
    }
    // &__item {
    //   width: 30%;
    // }
  }
  &__btns{
    text-align: center;
    & > button {
      margin-right: 8px;
      padding: 4px;
      font-size: 16px;
      cursor: pointer;
    }
  }
}
</style>
