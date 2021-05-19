<template>
  <div class="settings">
    <div class="settings__main">
      <label v-for="(item, index) in fields" :key="index"
        ><b>{{ item.name }}:</b
        ><input type="number" v-model="item.value" step="0.01"
      /></label>
    </div>
    <button class="settings__btn" @click="setSettings">
      Применить настройки
    </button>
  </div>
</template>

<script>
export default {
  name: 'Settings',
  data() {
    return {
      // fields: [
      //   { name: 'Стартовый капитал', value: this.settings.curCash, code: 'curCash' },
      //   { name: 'Длина портфеля', value: 20, code: 'maxLengthPortfolio' },
      //   {
      //     name: 'Коеф. для продажи (верхний)',
      //     value: 1.05,
      //     code: 'checkSellTop',
      //   },
      //   {
      //     name: 'Коеф. для продажи (нижний)',
      //     value: 0.05,
      //     code: 'checkSellBottom',
      //   },
      //   { name: 'Кол-во недель, для чекинга', value: 13, code: 'maxLowPeriod' },
      //   {
      //     name: 'Диапазон проверки (верхний)',
      //     value: 3,
      //     code: 'checkBuyTop',
      //   },
      //   {
      //     name: 'Диапазон проверки (нижний)',
      //     value: 0.5,
      //     code: 'checkBuyBottom',
      //   },
      //   { name: 'Лимитная цена акции', value: 0.3, code: 'minPriceStock' },
      //   { name: 'Коэф. усреднения', value: 0.5, code: 'middle' },
      //   { name: 'Коэф. фиксации', value: 0.3, code: 'fix' },
      //   { name: 'Кол-во докупок', value: 2, code: 'buyCount' },
      // ],
      fields: [],
    }
  },
  created() {
    this.setFields()
  },
  computed: {
    settings() {
      return this.$store.state.settings
    },
  },
  methods: {
    setFields() {
      const { settings } = this
      this.fields = [
        {
          name: 'Стартовый капитал',
          value: settings.curCash,
          code: 'curCash',
        },
        {
          name: 'Длина портфеля',
          value: settings.maxLengthPortfolio,
          code: 'maxLengthPortfolio',
        },
        {
          name: 'Коеф. для продажи (верхний)',
          value: settings.checkSellTop,
          code: 'checkSellTop',
        },
        {
          name: 'Коеф. для продажи (нижний)',
          value: settings.checkSellBottom,
          code: 'checkSellBottom',
        },
        {
          name: 'Кол-во недель, для чекинга',
          value: settings.maxLowPeriod,
          code: 'maxLowPeriod',
        },
        {
          name: 'Диапазон проверки (верхний)',
          value: settings.checkBuyTop,
          code: 'checkBuyTop',
        },
        {
          name: 'Диапазон проверки (нижний)',
          value: settings.checkBuyBottom,
          code: 'checkBuyBottom',
        },
        {
          name: 'Лимитная цена акции',
          value: settings.minPriceStock,
          code: 'minPriceStock',
        },
        { name: 'Коэф. усреднения', value: settings.middle, code: 'middle' },
        { name: 'Коэф. фиксации', value: settings.fix, code: 'fix' },
        { name: 'Кол-во докупок', value: settings.buyCount, code: 'buyCount' },
      ]
    },
    setSettings() {
      this.$store.dispatch('SET_SETTINGS', this.fields)
    },
  },
}
</script>

<style lang="scss">
.settings {
  padding: 24px 0;
  &__main {
    display: flex;
    flex-wrap: wrap;
    label {
      display: flex;
      flex-direction: column-reverse;
      margin: 12px 24px;
      max-width: 100px;
      height: 100%;
      input {
        width: 100%;
      }
    }
  }
  &__btn {
    padding: 8px;
    cursor: pointer;
  }
}
</style>
