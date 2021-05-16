<template>
  <div class="history-table">
    <table v-if="isReady">
      <thead>
        <tr>
					<th>#</th>
				</tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in arr" :key="index">
          <td>{{ index + 1 }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'HistoryTable',
  data() {
    return {
      isReady: false,
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      const message = {
        type: '/getHistoryTable',
      }
      try {
        const response = await this.$api.get(message)
        this.init(response.result)
      } catch (err) {
        setTimeout(() => {
          this.getData()
        }, 200)
      }
    },
    init(arr) {
			console.log(arr);
      this.arr = arr
      this.isReady = true
    },
  },
}
</script>

<style lang="scss">
.history-table {
}
</style>
