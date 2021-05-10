<template>
  <div>
    {{ portfolio.cost.toFixed(2) }}
		<span>Date: {{new Date(settings.currMoment * 1000).toLocaleDateString()}}</span>
  </div>
</template>

<script>
import template_func from 'template_func'

export default {
  name: 'Portfolio',
  data() {
    return {
      candidateToBy: [],
    }
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
    init(currMoment) {
      this.getCandidateToBuy()
      this.buyStocks()
			this.$store.commit('SET_COST_PORTFOLIO')
			console.log(this.portfolio.list)
    },
    getCandidateToBuy() {
      this.candidateToBy = []
      const { stocks, checkToBuy } = this
      Object.keys(stocks).forEach((symbol) => {
        const item = stocks[symbol]
        if (checkToBuy(item)) {
          this.candidateToBy.push(item)
        }
      })
    },
    checkToBuy(stock) {
      const { settings } = this
      const { partPrice } = settings
      return stock.price < partPrice
    },
    buyStocks() {
      const { settings, portfolio } = this
      if (portfolio.curCash <= settings.partPrice) return
      const stock = this.getRandomStock();
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

<style lang="scss"></style>
