<template>
  <div v-if="isPlay" class="play">
    <div class="play_header">
      <span class="play_header__item"
        >Дата:
        <span>{{
          new Date(+timeLine[lastIndex] * 1000).toLocaleDateString()
        }}</span></span
      >
      <span class="play_header__item"
        >Размер портфолио: <span>{{ cost.toLocaleString() }}</span></span
      >
      <span class="play_header__item">
        Наличные: <span>{{ curCash }}</span>
      </span>
      <span class="play_header__item">
        Потенциал: <span>{{ getPotencial().toFixed(2) }}%</span>
      </span>
    </div>
    <table class="portfolio__table">
      <thead>
        <th>#</th>
        <th>Name</th>
        <th>Quantity</th>
        <th>Buy Price</th>
        <th>Now Price</th>
        <th>Change price</th>
        <th>Now Cost</th>
        <th>Days in Portfolio</th>
        <th>BuyCount</th>
        <th>TopBuyCount</th>
      </thead>
      <tbody>
        <tr
          v-for="(item, symbol, index) in list"
          :key="index"
          class="portfolio__table__row"
        >
          <td>{{ index }}</td>
          <td>{{ symbol }}</td>
          <td>{{ item.qty }}</td>
          <td>{{ item.buyPrice.toFixed(4) }}</td>
          <td>{{ item.price.toFixed(4) }}</td>
          <td
            class="portfolio__table__row--change"
            :class="{ down: +item.change < 1 }"
          >
            {{ item.change }}
          </td>
          <td>{{ item.cost.toFixed(2) }}</td>
          <td>
            {{ Math.floor((item.timestamp - item.dateBuy) / 60 / 60 / 24) }}
          </td>
          <td>{{ item.buyCount }}</td>
          <td class="topBuyCount">{{ item.topBuyCount }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'PlayPortfolio',
  props: {
    data: { type: Object },
    isGo: { type: Boolean },
  },
  data() {
    return {
      isPlay: this.isGo,
      cost: '0',
      timeLine: [],
      lastIndex: 0,
      list: {},
      id: this.$route.params.id,
      timeout: 200,
    }
  },
  watch: {
    isGo(e) {
      if (e) {
        this.isPlay = true
      }
      this.playWrapper()
    },
    isPlay(e) {
      if (!e) return
      this.$store.commit('RESET_CHART_DATA', this.id)
    },
  },
  created() {
    this.createTimeline()
  },
  methods: {
    nextStep(){
      const nextItem = this.play(this.lastIndex++)
      this.setCost(nextItem)
      this.setList(nextItem)
    },
    previousStep(){
      const nextItem = this.play(this.lastIndex--)
      this.setCost(nextItem, false)
      this.setList(nextItem)
    },
    createTimeline() {
      const { data } = this
      this.timeLine = Object.keys(data).sort((a, b) => +a - +b)
    },
    playWrapper(){
      if (!this.isGo || !this.isPlay) return
      const nextItem = this.play(this.lastIndex++)
      this.setCost(nextItem)
      this.setList(nextItem)
      setTimeout(() => {
        this.playWrapper()
      }, this.timeout)

    },
    play(index = this.lastIndex) {
      const key = this.timeLine[index]
      const item = this.data[key]
      if (!item) {
        this.$emit('end-play')
        return
      }
      return item
    },
    setCost(item, step = true) {
      if (!item) return
      this.cost = item.cost
      this.curCash = item.curCash.toLocaleString()
      const payload = {
        id: this.id,
        data: [Math.round(item.cost)],
      }
      if (step) this.$store.commit('ADD_DATA_CHART', payload)
      if (!step) this.$store.commit('REMOVE_LAST_DATA_CHART', payload)
    },
    setList(item) {
      if (!item) return
      const { list } = item
      if (Object.keys(list).length === 0) return
      this.list = list
    },
    getPotencial() {
      const { list } = this
      let sum = 0
      Object.values(list).forEach((stock) => {
        const z = stock.buyPrice * stock.qty
        const now = z * stock.change
        const dif = z - now
        sum += dif
      })
      const percent = (sum / this.cost) * 100
      return percent
    },
  },
}
</script>

<style lang="scss">
.play {
  &_header {
    &__item {
      margin-right: 24px;
      span {
        font-weight: bold;
        font-size: 18px;
      }
    }
  }
}
</style>
