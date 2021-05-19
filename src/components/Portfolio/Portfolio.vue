<template>
  <div class="portfolio">
    {{ portfolio.cost.toFixed(2) }}
    <span
      >Date:
      {{ new Date(settings.currMoment * 1000).toLocaleDateString() }}</span
    >
    <br />
    <span><b>Cash: </b>{{ portfolio.curCash.toLocaleString() }}</span> <br />
    <span><b>Fixed: </b>{{ portfolio.fixed.toLocaleString() }}</span> <br />
    <span><b>Size: </b>{{ settings.partPrice.toLocaleString() }}</span>
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
          <td>
            {{
              Math.floor((settings.currMoment - item.dateBuy) / 60 / 60 / 24)
            }}
          </td>
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
      count: -180,
      add: 0,
      iteration: 0,
    }
  },
  created() {
    this.setpartPrice(1)
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
    'settings.currMoment': function() {
      this.init()
    },
  },
  methods: {
    setpartPrice() {
      const { portfolio, settings } = this
      const { cost } = portfolio
      if (this.settings.icrementPortfolio) {
        if (this.iteration % 270 !== 0) return
        this.settings.maxLengthPortfolio++
      }
        const { maxLengthPortfolio } = settings

      const value =
        Math.floor(cost / maxLengthPortfolio) < 100
          ? 100
          : Math.floor(cost / maxLengthPortfolio)
      this.$store.commit('SET_PARTPRICE', value)
    },
    getNowPrice(stock) {
      if (!stock.price) return '----'
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
      this.iteration++
      const { settings, portfolio } = this
      this.count++
      if (this.count % 90 === 0) {
        const add = settings.partPrice > 1500 ? 1500 : settings.partPrice
        this.add += add
        this.$store.commit('ADD_TO_CURCASH', 0)
      }
      this.sellStocks()
      this.$store.commit('SET_COST_PORTFOLIO')
      this.setpartPrice()
      if (settings.partPrice > portfolio.curCash) return
      this.checkSellLowStock()
      if (settings.partPrice > portfolio.curCash) return
      this.getCandidateToBuy()
      this.buyStocks()
    },
    checkSellLowStock() {
      const { portfolio, settings, stocks } = this
      const { middle } = settings
      if (settings.partPrice > portfolio.curCash) return
      const { list } = portfolio
      Object.keys(list).forEach((symbol) => {
        if (settings.partPrice > portfolio.curCash) return
        if (list[symbol].change < middle) {
          const stock = stocks[symbol]
          if (!stock) return
          if (stock.buyCount === settings.buyCount) return
          const z = list[symbol]
          // console.log(
          //   symbol,
          //   `Change: ${z.change}  buyPrice: ${z.buyPrice.toFixed(
          //     2
          //   )}  nowPrice: ${z.stock.price}  qty: ${
          //     z.qty
          //   } sum: ${settings.partPrice.toFixed(
          //     2
          //   )} curCash: ${portfolio.curCash.toFixed(2)}`
          // )
          this.$store.dispatch('BUY_STOCK', { stock, sum: settings.partPrice })
          this.setpartPrice()
        }
      })
    },
    sellStocks() {
      const { portfolio, checkToSell, $store, settings } = this
      Object.keys(portfolio.list).forEach((symbol) => {
        const item = portfolio.list[symbol]
        if (checkToSell(item)) {
          $store.dispatch('SELL_STOCK', { item, settings })
        }
      })
    },
    checkToSell(item) {
      const { settings } = this

      if (item.buyCount === settings.buyCount) {
        if (+item.change <= settings.checkSellBottom) return true
      }

      if (item.buyPrice >= item.stock.price) {
        return +item.change < settings.checkSellBottom
      }
      return +item.change > settings.checkSellTop
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
      if (stock.price < settings.minPriceStock) return false
      if (stock.price > partPrice) return false
      if (!stock.lowPrice) return false
      if (stock.lowPrice / stock.price > settings.checkBuyBottom) return false
      if (stock.maxPrice / stock.price < settings.checkBuyTop) return false
      return true
    },
    buyStocks() {
      const { settings, portfolio } = this
      if (portfolio.curCash <= settings.partPrice) return
      const stock = this.getRandomStock()
      if (!stock || !stock.price) return
      // console.log(`BUY: ${stock.symbol}  price: ${stock.price.toFixed(2)}`)
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
