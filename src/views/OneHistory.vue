<template>
  <div class="history_chart">
    <HistoryChart
      :data="history"
      v-if="isReady"
      :key="$route.params.id"
      local
    ></HistoryChart>
  </div>
</template>

<script>
import HistoryChart from '../components/HistoryChart'
export default {
  name: 'OneHistory',
  components: { HistoryChart },
  created() {
    this.getData()
  },
  data() {
    return {
      history: [],
      isReady: false,
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
  padding-right: 24px;
  .history-elem__item {
    width: 100%;
  }
}
</style>
