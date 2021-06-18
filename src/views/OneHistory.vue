<template>
  <div class="history_chart" v-if="isReady">
    <button @click="isGo = !isGo">{{ isGo ? 'Pause' : 'Play' }}</button>
    <div class="history_chart_body">
      <HistoryChart
        :data="history"
        :id="$route.params.id"
        local
        class="history_chart_body__item"
      ></HistoryChart>
      <PlayPortfolio
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
}
</style>
