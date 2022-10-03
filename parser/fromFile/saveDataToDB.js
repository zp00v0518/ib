const BulkWriteDB = require('../../backend/db/BulkWriteDB')
const ConnectMongoDB = require('../../backend/db/connectMongoDB.js')
const config = require('../../config')
const splitArrOnSmallArr = require('../splitArrOnSmallArr')
const mongo = new ConnectMongoDB()

async function saveDataToDB(arr = [], collectionName = 'data') {
  if (arr.length === 0) {
    console.log('Массив для записи пустой')
    return
  }
  const bulkMethod = new BulkWriteDB(mongo)
  await bulkMethod.connect(config.db.name)
  const modifyData = modifyDataForSave(arr)
  let bulkList = createListBulkWrite(modifyData)
  bulkList = splitArrOnSmallArr(bulkList, 100)
  let count = 0
  for (const arr of bulkList) {
    await bulkMethod.set(collectionName, arr);
    count++
  }
  await bulkMethod.close();
}

function modifyDataForSave(arr) {
  const result = {}
  arr.forEach((elem) => {
    const { symbol, data } = elem
    data.forEach((item) => {
      const timestamp = new Date(item.d).getTime() / 1000
      if (!result[timestamp]) result[timestamp] = {}
      const dataBlock = getDataBlock(item)
      result[timestamp].timestamp = timestamp
      result[timestamp].date = item.d
      result[timestamp][symbol] = dataBlock
    })
  })
  return result
}

function getDataBlock(item) {
  return {
    c: +item.c,
    o: +item.o,
    v: +item.v,
    l: +item.l,
    h: +item.h,
  }
}

function createListBulkWrite(data) {
  const result = []
  Object.keys(data).forEach((key) => {
    const item = data[key]
    item.timestamp = +item.timestamp
    const template = {
      filter: {
        timestamp: +key,
      },
      update: {
        $set: {
          ...item,
        },
      },
      upsert: true,
    }
    result.push({ updateOne: template })
  })
  return result
}
module.exports = saveDataToDB
