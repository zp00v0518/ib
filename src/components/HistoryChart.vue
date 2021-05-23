<template>
  <article class="history-elem__item">
    <div>
      <router-link
        v-if="!local"
        :to="'/history/' + data._id"
        class="history-elem__item--title"
        >${{ getCostPortfolio(data).toLocaleString() }}</router-link
      >
      <div v-else>
        <div class="history-elem__item--title">
          ${{ getCostPortfolio(data).toLocaleString() }}
        </div>
      </div>
      <br />
      <div>
        Общая сумма:
        <span class="total-value">
          ${{ (getCostPortfolio(data) + saveHistory.fixed).toLocaleString() }}
        </span>
      </div>

      <div v-if="saveHistory">
        Дивиденды: <span>{{ saveHistory.dividends.toLocaleString() }}</span>
      </div>
      <div v-if="saveHistory">
        Отложил: <span>{{ saveHistory.fixed.toLocaleString() }}</span>
      </div>
    </div>
    <div ref="wrap">
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
      cost: this.getCostPortfolio(this.data),
      isPlay: true,
    }
  },
  computed: {
    chartData() {
      return this.$store.state.play.charts[this.id]
    },
    saveHistory() {
      return this.$store.state.history.history[this.id]
    },
  },
  watch: {
    chartData: {
      immediate: true,
      deep: true,
      handler(e) {
        if (this.chart) {
          this.chart.data.datasets[0].data = e
          const width = this.chart.canvas.width - 1
          const height = this.chart.canvas.height - 1
          this.chart.resize(width, height)
        }
      },
    },
  },
  created() {
    if (!this.chartData) {
      const data = this.getDataForChart(this.data)
      this.$store.commit('ADD_DATA_CHART', { id: this.$route.params.id, data })
    }
  },
  methods: {
    getColor() {
      const index = template_func.getRandomNumber(colors.length - 1)
      return colors[index]
    },
    setChart() {
      let canvas = this.$el.querySelector('canvas')
      if (!canvas) {
        canvas = document.createElement('canvas')
        this.$refs.wrap.appendChild(canvas)
      }
      const ctx = canvas.getContext('2d')
      let x = []
      if (!this.chartData) {
        x = this.getDataForChart(this.data)
      }
      const data = {
        labels: this.bottomLabels,
        datasets: [
          {
            label: this.cost,
            data: this.chartData || x,
            fill: true,
            // borderColor: this.getColor(),
            borderColor: 'rgb(75, 192, 192)',
            // borderWidth: 5,
            pointRadius: 1,
          },
          {
            label: this.saveHistory.fixed.toFixed(2),
            data: this.getFixedData(this.data),
            fill: true,
            borderColor: 'red',
            pointRadius: 1,
          },
        ],
      }
      this.chart = new Chart(ctx, {
        type: 'line',
        data,
        options: {
          animations: false,
        },
      })
    },
    getLabelsForChart(item) {
      const x = item.data || item
      const result = Object.keys(x).map((time) =>
        new Date(+time * 1000).toLocaleDateString()
      )
      return result
    },
    getDataForChart(item) {
      const z = item.data || item
      const result = Object.keys(z).map(
        // (time) => z[time].cost
        (time) => z[time].cost + z[time].fixed
      )
      return result
    },
    getFixedData(item) {
      const z = item.data || item
      const result = Object.keys(z).map((time) => z[time].fixed)
      return result
    },
    getCostPortfolio(item) {
      const x = item.data || item
      const keys = Object.keys(x)
      const lastItemKey = keys[keys.length - 1]
      if (!x[lastItemKey]) return 0
      return +x[lastItemKey].cost.toFixed(2)
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
.total-value {
  font-weight: bold;
  font-size: 20px;
}
</style>
