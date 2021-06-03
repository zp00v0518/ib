const cash = 1300
const items = 13;
const startSum = cash/items
const persent = 0.01
const steps = 1000
const result = Math.floor(startSum * Math.pow(1 + persent, steps)-100)
const grow  = ((cash+result) / cash * 100 - 100)
console.log(l(result), '********', l(grow)+'%');

function l(value){
  return new Intl.NumberFormat('ru-RU').format(value);
}