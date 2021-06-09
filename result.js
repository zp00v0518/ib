const startSum = 60000
// const startSum = cash/items
const persent = 0.5
const steps = 7
const result = Math.floor(startSum * Math.pow(1 + persent, steps))
const grow  = (result /  startSum) * 100 - 100
console.log(l(result), '********', l(grow)+'%');

function l(value){
  return new Intl.NumberFormat('ru-RU').format(value);
}