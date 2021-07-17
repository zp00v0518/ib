const startSum = 16000
// const startSum = cash/items
const persent = 0.003125
const steps = 100
const result = Math.floor(startSum * Math.pow(1 + persent, steps))
const grow  = (result /  startSum) * 100 - 100
console.log(l(result), '********', l(grow)+'%');

function l(value){
  return new Intl.NumberFormat('ru-RU').format(value);
}

// const z = (Math.pow(100, 0.1) - 1) * 100;
// console.log(z)