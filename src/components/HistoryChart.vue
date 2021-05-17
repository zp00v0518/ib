<template>
  <article class="history-elem__item">
    <router-link
      v-if="!local"
      :to="'/history/' + id"
      class="history-elem__item--title"
      >${{ getCostPortfolio(data).toLocaleString() }}</router-link
    >
    <div v-else>
      <div class="history-elem__item--title">
        ${{ getCostPortfolio(data).toLocaleString() }}
      </div>
    </div>
    <div>
      <canvas></canvas>
    </div>
  </article>
</template>

<script>
import template_func from 'template_func'
import Chart from 'chart.js/auto'

const colors = [
  '#49afff',
  '#ffaf51',
  '#ff8888',
  '#d76349',
  '#4687d7',
  '#aed6d6',
  '#44aeae',
  '#aed765',
  '#af62af',
  '#6261af',
  '#9f9699',
  '#c2cf5d',
  '#83a1e8',
  '#b971d5',
  '#159eff',
  '#ff9d1d',
  '#ff6c6c',
  '#ce3d16',
  '#126cce',
  '#9dcdcd',
  '#109d9d',
  '#9dcf3e',
  '#9e3c9e',
  '#3d3c9d',
  '#8b7f82',
  '#810d1d',
  '#8aabe6',
  '#443fb0',
  '#148905',
  '#a74cd2',
  '#2af58b',
  '#8d6d71',
  '#e0efca',
  '#a6922a',
]

export default {
  name: 'HistoryChart',
  props: {
    data: { type: [Object] },
    id: { type: String },
    local: { type: Boolean, default: false },
  },
  data() {
    return {
      chart: null,
      bottomLabels: this.getLabelsForChart(this.data),
      chartData: this.getDataForChart(this.data),
      cost: this.getCostPortfolio(this.data),
      isPlay: true,
    }
  },
  methods: {
    getColor() {
      const index = template_func.getRandomNumber(colors.length - 1)
      return colors[index]
    },
    setChart() {
      const canvas = this.$el.querySelector('canvas')
      const ctx = canvas.getContext('2d')
      const data = {
        labels: this.bottomLabels,
        // labels: this.getLabelsForChart(item),
        datasets: [
          {
            label: this.cost,
            data: this.chartData,
            fill: true,
            // borderColor: this.getColor(),
            borderColor: 'rgb(75, 192, 192)',
          },
        ],
      }
      this.chart = new Chart(ctx, {
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
      if (!item[lastItemKey]) return 0
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
