<template>
  <div class="traide">
    <button @click="handlerStart" class="traide__btn">
      {{ isWork ? 'Pause' : 'Start' }}
    </button>
    <button @click="showStore">Show store</button>
    <Settings></Settings>
    <Portfolio></Portfolio>
  </div>
</template>

<script>
import Settings from '../components/Settings'
import Portfolio from '../components/Portfolio'

export default {
  name: 'Traiding',
  components: { Settings, Portfolio },
  data() {
    return {
      isWork: false,
      timeout: 50,
      lastTimestamp: 0,
    }
  },
  computed: {
    settings() {
      return this.$store.state.settings
    },
  },
  methods: {
    showStore() {
      console.log(this.$store)
    },
    handlerStart() {
      this.isWork = !this.isWork
      // this.goImitation();
      if (this.isWork) this.goTraiding()
    },
    async goImitation(){
      const {settings} = this;
      const message = {
        type: '/getImmitation',
        data: settings
      }
      const response = await this.$api.get(message);
      console.log(response);
    },
    async goTraiding() {
      if (!this.isWork) return
      const { $store } = this
      const message = {
        type: '/traiding',
        data: this.formatDataResponse(),
      }
      const response = await this.$api.get(message)
      const { period } = response
      const arr = period.pop()
      if (!arr) return
      ;[arr].forEach((objData) => {
        Object.keys(objData).forEach((symbol) => {
          if (symbol === 'timestamp' || symbol === '_id') return
          $store.commit('ADD_STOCKS_TO_LIST', { symbol, data: objData[symbol] })
        })
      })
      $store.commit('CURRMOMENT_INCREMENT')
      if (this.isWork) {
        setTimeout(() => {
          this.goTraiding()
        }, this.timeout)
      }
    },
    formatDataResponse() {
      const { settings } = this
      const day = 60 * 60 * 24
      const week = day * 7
      const week_26 = week * 26
      const template = {
        period: {
          symbols: [],
          range: [settings.currMoment - day * 5, settings.currMoment],
        },
        moment: {
          timestamp: 1000,
          symbols: [],
        },
      }

      return template
    },
  },
}
</script>
<style lang="scss">
.traide {
  &__btn {
    padding: 8px;
    cursor: pointer;
  }
}
</style>
