let value = 100
const persent = 5
for (let i = 0; i < 200; i++) {
  const step = (value / 100) * persent
  value += step
}

console.log(value)
