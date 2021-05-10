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
      timeout: 10000,
    }
  },
  computed: {
    settings() {
      return this.$store.state.settings
    },
  },
  created() {
    console.log(this.settings)
  },
  methods: {
    handlerStart() {
      this.isWork = !this.isWork
      if (this.isWork) this.goTraiding()
    },
    async goTraiding() {
      if (!this.isWork) return
      const message = {
        type: '/traiding',
        data: this.formatDataResponse(),
      }
      const response = await this.$api.get(message)
      if (this.isWork) {
        setTimeout(() => {
          this.goTraiding()
        }, this.timeout)
      }
    },
    formatDataResponse() {
      const template = {
        period: {
          all: false,
          symbols: [],
        },
        moment: {
          timestamp: 1000,
          all: false,
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
