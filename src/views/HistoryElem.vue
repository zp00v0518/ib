<template>
  <div class="history-elem">
    <HistoryChart
      v-for="(item, index) in data"
      :key="index"
      :data="item"
    ></HistoryChart>
  </div>
</template>

<script>
import Chart from 'chart.js/auto'
import HistoryChart from '../components/HistoryChart'

export default {
  name: 'HistoryElem',
  components: { HistoryChart },
  data() {
    return {
      isReady: false,
      data: [],
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      const id = this.$route.params.id
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
        }, 200)
      }
    },
    init(ev) {
      this.isReady = true
      this.data = ev.data.sort((a, b) => {
        return this.getCostPortfolio(a) - this.getCostPortfolio(b)
      })
    },
    getCostPortfolio(item) {
      const keys = Object.keys(item)
      const lastItemKey = keys[keys.length - 1]
      return item[lastItemKey].cost.toFixed(2)
    },
    setChart(item, index) {
      const elems = this.$el.querySelectorAll('canvas')
      if (elems.length === 0) {
        setTimeout(() => {
          this.setChart(item, index)
        }, 200)
        return
      }
      const ctx = elems[index].getContext('2d')
      const data = {
        labels: this.getLabelsForChart(item),
        datasets: [
          {
            label: this.getCostPortfolio(item),
            data: this.getDataForChart(item),
            fill: true,
            borderColor: 'rgb(75, 192, 192)',
          },
        ],
      }
      new Chart(ctx, {
        type: 'line',
        data,
      })
    },
    getLabelsForChart(item) {
      const result = Object.keys(item).map((time) =>
        new Date(+time * 1000).toLocaleDateString()
      )
      return result
    },
    getDataForChart(item) {
      const result = Object.keys(item).map((time) => item[time].cost)
      return result
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
