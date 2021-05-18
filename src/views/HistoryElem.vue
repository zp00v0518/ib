<template>
  <div class="history-elem">
    <HistoryChart
      v-for="(item, index) in data"
      :key="index"
      :data="item"
      :id="item._id"
    ></HistoryChart>
      <!-- :id="listIds[index]" -->
  </div>
</template>

<script>
import HistoryChart from '../components/HistoryChart'

export default {
  name: 'HistoryElem',
  components: { HistoryChart },
  data() {
    return {
      isReady: false,
      data: [],
      listIds: [],
    }
  },
  created() {
    this.getData()
  },
  computed: {
    saveSettings() {
      return this.$store.state.history.settings
    },
  },
  methods: {
    async getData() {
      const id = this.$route.params.id
      if (this.saveSettings[id]) {
        this.init(this.saveSettings[id])
        return
      }
      const message = {
        type: '/getHistoryBlock',
        id,
      }
      try {
        const response = await this.$api.get(message)
        this.init(response.result)
      } catch (err) {
        setTimeout(() => {
          this.getData()
        }, 1000)
      }
    },
    init(ev) {
      this.isReady = true
      this.listIds = ev.list
      this.data = ev.data.map(i => i.data);
      this.data = ev.data.sort((histA, histB) => {
        return this.getCostPortfolio(histA.data) - this.getCostPortfolio(histB.data)
      })
      this.$store.commit('ADD_SETTINGS_ELEM', { id: ev._id, data: ev })
      this.data.forEach((elem, index) => {
        const payload = {
          data: elem,
          id: elem._id
        }
        this.$store.commit('ADD_HISTORY_ELEM', payload)
      })
    },
    getCostPortfolio(item) {
      const x = item;
      const keys = Object.keys(x)
      const lastItemKey = keys[keys.length - 1]
      return x[lastItemKey].cost.toFixed(2)
    },
  },
}
</script>

<style lang="scss">
.history-elem {
  display: flex;
  flex-wrap: wrap;
  &__item {
    width: 45%;
    flex-grow: 2;
    margin: 20px;
  }
}
</style>
