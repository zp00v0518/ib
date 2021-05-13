<template>
  <div>
    <button @click="testRequest">Test request</button>
  </div>
</template>

<script>
export default {
  name: 'Test',
  methods: {
    async testRequest() {
      const message = {
        subscribe: [
          'SSY',
        ],
      }

      const response = await this.$api.get(message)
      console.log(response)
    },
  },
}
</script>

<style lang="scss"></style>
