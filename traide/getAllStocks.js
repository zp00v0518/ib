const config = require('../config')
const getFindMethod = require('./getFindMethod')
const compareData = require('./compareData')
const splitDataByTime = require('./splitDataByTime')

async function getAllStocks() {
  const find = await getFindMethod()
  const collectionName = config.db.collections.data2.name
  let result = []
  // const findList = await find.one(collectionName, { query: { class: "list" } });
  const findAll = await find.all(collectionName, undefined, {
    needFields: { _id: 1 },
  })
  let count = findAll.result.length
  count -= 1
  const step = 100
  const list = findAll.result.map((i) => i._id)
  console.time('start')
  const iterator = Array.from({ length: Math.ceil(count / step) }).map(
    (i, index) => index + 1
  )
  for (const index of iterator) {
    // if(index > 1) break;
    const wants = list.splice(0, step)
    const query = {
      _id: { $in: wants },
    }
    const findResult = await find.all(collectionName, query)
    const arr = compareData(findResult.result)
    result = result.concat(arr)
  }
  result = splitDataByTime(result)
  find.close()
  try {
    await insertSplitr(result);
  } catch (err) {
    console.log(err)
  }
  console.timeEnd('start')
}
const InsertDB = require('../backend/db/InsertDB')
const ConnectMongoDB = require('../backend/db/connectMongoDB.js')
const mongo = new ConnectMongoDB()

async function insertSplitr(obj) {
  const arr = Object.keys(obj).map((key) => {
    const item = obj[key]
    item.timestamp = +key
    if(key.includes('.')){
      console.log()
    }
    return item
  })
  const insertMethod = new InsertDB(mongo)
  await insertMethod.connect(config.db.name)
  const collectionName = config.db.collections.splitData2.name
  await insertMethod.many(collectionName, arr)
  await insertMethod.close()
}

module.exports = getAllStocks
