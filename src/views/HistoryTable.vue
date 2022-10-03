<template>
  <div class="history-table">
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Max result</th>
          <th>Min result</th>
          <th>Extra Buy Count</th>
          <th>Extra buy coef</th>
          <th>buy bottom</th>
          <th>buy top</th>
          <th>Renko</th>
          <th>Renko Arr</th>
          <th>Max Volatility</th>
          <th>Min Volatility</th>
          <th>Sell bottom</th>
          <th>Sell top</th>
          <th>Fix</th>
          <th>Portfolio length</th>
          <th>Max-Low period</th>
          <th>Min stock price</th>
          <th>Add Sum</th>
          <th>Add Period</th>
          <th>Include Dividends</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in table"
          :key="index"
          @click="goToHistory(item)"
        >
          <td>{{ index + 1 }}</td>
          <td>{{ item.maxCost.toLocaleString(2) }}</td>
          <td>{{ item.minCost.toLocaleString(2) }}</td>
          <td>{{ item.buyCount }}</td>
          <td>{{ item.middle }}</td>
          <td>{{ item.checkBuyBottom }}</td>
          <td>{{ item.checkBuyTop }}</td>
          <td>{{ item.renkoGrow }}</td>
          <td>{{ item.renkoArr ? item.renkoArr.join('-') : '-'}}</td>
          <td>{{ item.minVolatility }}</td>
          <td>{{ item.maxVolatility }}</td>
          <td>{{ item.checkSellBottom }}</td>
          <td>{{ item.checkSellTop }}</td>
          <td>{{ item.fix.toFixed(2) }}</td>
          <td>{{ item.maxLengthPortfolio }}</td>
          <td>{{ item.maxLowPeriod / 7 }}</td>
          <td>{{ item.minPriceStock }}</td>
          <td>{{ item.addition }}</td>
          <td>{{ item.additionPeriod }}</td>
          <td>{{ item.withDividends ? 'Yes' : 'No' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'HistoryTable',
  created() {
    if (this.table.length === 0) {
      this.getData()
    }
  },
  computed: {
    table() {
      return this.$store.state.history.table
    },
  },
  methods: {
    async getData() {
      if (this.table.length > 0) return
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
      console.log(arr)
      this.$store.commit('SET_TABLE', arr)
    },
    goToHistory(item) {
      this.$router.push(this.$route.path + `/${item._id}`)
    },
  },
}
</script>

<style lang="scss">
.history-table {
  padding: 0 24px;
  table,
  th,
  td {
    border: 1px solid;
  }
  table {
    width: 100%;
    text-align: center;
    border-collapse: collapse;
    thead {
      font-weight: bold;
      text-transform: capitalize;
      background-color: #999999;
    }
    th,
    td {
      padding: 12px 8px;
    }
    tbody {
      tr {
        &:hover {
          background-color: #d6d6d6 !important;
          cursor: pointer;
        }
        &:nth-child(even) {
          background-color: #ebebeb;
        }
      }
    }
  }
}
</style>
