<template>
  <div class="traide">
    <button @click="handlerStart" class="traide__btn">
      {{ isWork ? 'Pause' : 'Start' }}
    </button>
    <Settings></Settings>
  </div>
</template>

<script>
import Settings from '../components/Settings'

export default {
  name: 'Traiding',
  components: { Settings },
  created() {
    console.log(this.$api)
  },
  data() {
    return {
      isWork: false,
      timeout: 2000,
      lastTimestamp: 0,
    }
  },
  computed: {
    settings() {
      return this.$store.state.settings
    },
  },
  methods: {
    handlerStart() {
      this.isWork = !this.isWork
      if (this.isWork) this.goTraiding()
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
      period.forEach((objData) => {
        Object.keys(objData).forEach((symbol) => {
          if (symbol === 'timestamp') return;
          $store.commit('ADD_STOCKS_TO_LIST', { symbol, data: objData[symbol] })
        })
      });
      console.log($store.state.stocks.list)

      $store.commit('CURRMOMENT_INCREMENT')
      if (this.isWork) {
        setTimeout(() => {
          this.goTraiding()
        }, this.timeout)
      }
    },
    formatDataResponse() {
      const { settings } = this
      const week = 60 * 60 * 24 * 7
      const week_26 = week * 26
      const template = {
        period: {
          symbols: [],
          range: [settings.currMoment - week_26, settings.currMoment],
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
