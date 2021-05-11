<template>
  <div class="portfolio">
    {{ portfolio.cost.toFixed(2) }}
    <span
      >Date:
      {{ new Date(settings.currMoment * 1000).toLocaleDateString() }}</span
    >
    <br />
    <span><b>Cash: </b>{{ portfolio.curCash }}</span>
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
      </thead>
      <tbody>
        <tr
          v-for="(item, symbol, index) in portfolio.list"
          :key="index"
          class="portfolio__table__row"
        >
          <td>{{ index }}</td>
          <td>{{ symbol }}</td>
          <td>{{ item.qty }}</td>
          <td>{{ item.buyPrice.toFixed(4) }}</td>
          <td>{{ getNowPrice(item.stock) }}</td>
          <td
            class="portfolio__table__row--change"
            :class="{ down: +item.change < 1 }"
          >
            {{ item.change }}
          </td>
          <td>{{ getNowCost(item.stock, item.qty) }}</td>
          <td>{{ Math.floor((settings.currMoment - item.dateBuy) / 60 / 60 / 24) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import template_func from 'template_func'

export default {
  name: 'Portfolio',
  data() {
    return {
      candidateToBy: [],
      profit: 5,
      loss: 30,
    }
  },
  created() {
    this.setpartPrice()
  },
  computed: {
    stocks() {
      return this.$store.state.stocks.list
    },
    settings() {
      return this.$store.state.settings
    },
    portfolio() {
      return this.$store.state.portfolio
    },
  },
  watch: {
    'settings.currMoment': function(currMoment) {
      this.init(currMoment)
    },
  },
  methods: {
    setpartPrice() {
      const { portfolio } = this
      const { maxLength, cost } = portfolio
      const value =
        Math.floor(cost / maxLength) < 100 ? 100 : Math.floor(cost / maxLength)
      this.$store.commit('SET_PARTPRICE', value)
    },
    getNowPrice(stock) {
      if (!stock.price) return 'NaN'
      const priceString = stock.price.toString()
      if (!priceString.includes('.')) {
        return priceString + '.00'
      }
      return stock.price.toFixed(4)
    },
    getNowCost(stock, qty) {
      const cost = stock.price * qty
      if (!cost.toString().includes('.')) {
        return cost + '.00'
      }
      return cost.toFixed(4)
    },

    init(currMoment) {
      this.sellStocks()
      this.$store.commit('SET_COST_PORTFOLIO')
      this.setpartPrice()
      this.getCandidateToBuy()
      this.buyStocks()
    },
    sellStocks() {
      const { portfolio, checkToSell, $store } = this
      Object.keys(portfolio.list).forEach((symbol) => {
        const item = portfolio.list[symbol]
        if (checkToSell(item)) {
          $store.dispatch('SELL_STOCK', item)
        }
      })
    },
    checkToSell(item) {
      if (item.buyPrice >= item.stock.price) {
        return +item.change < 0.5
      }
      return +item.change > 1.1
    },
    getCandidateToBuy() {
      this.candidateToBy = []
      const { stocks, checkToBuy, portfolio } = this
      Object.keys(stocks).forEach((symbol) => {
        const item = stocks[symbol]
        if (checkToBuy(item)) {
          this.candidateToBy.push(item)
        }
      })
      const listUse = Object.keys(portfolio.list)
      this.candidateToBy = this.candidateToBy.filter(
        (i) => !listUse.includes(i.symbol)
      )
    },
    checkToBuy(stock) {
      const { settings } = this
      const { partPrice } = settings
      if (stock.price < 0.00001) return false
      if (stock.price > partPrice) return false
      if (stock.lowPrice / stock.price > 0.8) return false
      if (stock.maxPrice / stock.price < 1.3) return false
      return true
    },
    buyStocks() {
      const { settings, portfolio } = this
      if (portfolio.curCash <= settings.partPrice) return
      const stock = this.getRandomStock()
      if (!stock) return
      this.$store.dispatch('BUY_STOCK', { stock, sum: settings.partPrice })
    },
    getRandomStock() {
      const { candidateToBy } = this
      const index = template_func.getRandomNumber(candidateToBy.length - 1)
      return candidateToBy[index]
    },
  },
}
</script>

<style lang="scss">
.portfolio {
  &__table {
    &__row {
      text-align: center;
      &--change {
        color: green;
        font-weight: 600;
        &.down {
          color: red;
        }
      }
    }
  }
}
</style>
