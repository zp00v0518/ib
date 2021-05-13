const fs = require('fs')
// const str = 'Tm8gdG8gUmFjaXNt'
const str = 'CgNTU1kVhXxEQBjg4caarF4qA0FTRTAIOAFF3v6oPkji4TBlAHslPNgBCA=='
const x = Buffer.from(str, 'base64')
console.log(x)
fs.writeFileSync('./qqq.txt', x);
const z = x.toString('binary')
console.log(z)
