<template>
  <div>
    HistoryElem
  </div>
</template>

<script>
export default {
  name: 'HistoryElem',
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      const id = this.$route.params.id
      const message = {
        type: '/getHistoryBlock',
        id,
      }
      try {
        const response = await this.$api.get(message)
        this.init(response)
      } catch (err) {
        setTimeout(() => {
          this.getData()
        }, 200)
      }
    },
    init(ev) {
      console.log(ev)
    },
  },
}
</script>

<style lang="scss"></style>
