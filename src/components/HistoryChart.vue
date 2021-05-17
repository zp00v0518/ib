<template>
  <article class="history-elem__item">
    <div class="history-elem__item--title">${{ getCostPortfolio(data).toLocaleString() }}</div>
    <canvas ref="canvas"></canvas>
  </article>
</template>

<script>
import Chart from 'chart.js/auto'

export default {
  name: 'HistoryChart',
  props: ['data'],
  methods: {
    setChart(item) {
      const canvas = this.$el.querySelector('canvas')
      const ctx = canvas.getContext('2d')
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
    getCostPortfolio(item) {
      const keys = Object.keys(item)
      const lastItemKey = keys[keys.length - 1]
      return +item[lastItemKey].cost.toFixed(2)
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.setChart(this.data)
    })
  },
}
</script>

<style lang="scss">
.history-elem__item {
  &--title {
    font-weight: bold;
    font-size: 20px;
  }
}
</style>
