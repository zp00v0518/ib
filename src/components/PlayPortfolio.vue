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
        >Размер портфолио: <span>{{ cost }}</span></span
      >
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
          <td>{{item.buyCount}}</td>
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
      cost: 0,
      timeLine: [],
      lastIndex: 0,
      list: {},
      id: this.$route.params.id,
      timeout: 100
    }
  },
  watch: {
    isGo(e) {
      if (e) {
        this.isPlay = true
      }
      this.play()
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
    createTimeline() {
      const { data } = this
      this.timeLine = Object.keys(data).sort((a, b) => +a - +b)
    },
    play() {
      if (!this.isGo || !this.isPlay) return
      const key = this.timeLine[this.lastIndex]
      const item = this.data[key]
      if(!item){
        this.$emit('end-play')
        return;
      }
      this.setCost(item)
      this.setList(item)
      this.lastIndex++
      setTimeout(() => {
        this.play()
      }, this.timeout)
    },
    setCost(item) {
      if(!item) return;
      this.cost = item.cost.toFixed(2)
      const payload = {
        id: this.id,
        data: [this.cost],
      }
      this.$store.commit('ADD_DATA_CHART', payload)
    },
    setList(item) {
      if(!item) return;
      const { list } = item
      if (Object.keys(list).length === 0) return
      this.list = list
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
