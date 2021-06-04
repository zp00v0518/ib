const cash = 3000
const items = 1;
const startSum = 1000
// const startSum = cash/items
const persent = 0.35
const steps = 10
const result = Math.floor(startSum * Math.pow(1 + persent, steps))
const grow  = (result /  startSum) * 100 - 100
console.log(l(result), '********', l(grow)+'%');

function l(value){
  return new Intl.NumberFormat('ru-RU').format(value);
}