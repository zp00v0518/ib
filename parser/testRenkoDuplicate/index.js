const fs = require("fs");
const path = require("path");
const { getAllSplitData } = require('../../backend/immitation/db');
const settings = require('../../config/settings')
const config = require('../../config')
const getRenkoChart = require('../../backend/immitation/calculateImmitation/methods/getRenkoChart')


setTimeout(() => {
    start();
}, 1000);

async function start() {
    const collectionName = config.db.collections.splitMacroTrend.name
    const allData = await getAllSplitData(settings, collectionName)
    // allData.length = 2000
    const formatData = getFormatData(allData)
    setRenkoChart(formatData)
    setDuplicate(formatData)
    let result = removeEmty(formatData)
    result  = setAccros(result)
    result  = filterByPercent(result, 0.01)
    result  = removeDownKeys(result)
    const pathFile = path.resolve(__dirname, './result.json' );
    fs.writeFileSync(pathFile, JSON.stringify(result))
    console.log(123)
}

function getFormatData(allData) {
    const result = {}
    allData.forEach(obj => {
        delete obj._id
        delete obj.date
        delete obj.timestamp
        Object.keys(obj).forEach(tickerName => {
            if (!result[tickerName]) {
                result[tickerName] = {
                    tickerName,
                    prices: []
                }
            }
            result[tickerName].prices.push(obj[tickerName].o)
        })
    })
    return result
}

function setRenkoChart(data) {
    Object.keys(data).forEach(tickerName => {
        const item = data[tickerName]
        item.renkoChart = getRenkoChart(item.prices, settings.renkoGrow)
    })
    return data
}

function setDuplicate(data) {
    Object.keys(data).forEach(tickerName => {
        const item = data[tickerName]
        item.duplicate = getDuplicate(item.renkoChart)
    })
}

function getDuplicate(targetArr) {
    const start = 5
    let sizeTarget = start;
    targetArr = targetArr.map(i => Number(i))
    const str = targetArr.join("");
    const result = {};
    for (; sizeTarget < Math.ceil(targetArr.length / 2); sizeTarget++) {
        if (start * 4 < sizeTarget) break
        made();
    }

    function made() {
        for (let i = 0; i < targetArr.length; i++) {
            if (i + sizeTarget > targetArr.length - 1) break;
            const checkStr = str.slice(i, i + sizeTarget);
            if (result[checkStr]) continue;
            const f = [...str.matchAll(checkStr)];
            if (f.length <= 1) continue;
            const nextArr = [];
            f.forEach((elem) => {
                nextArr.push(str[elem.index + sizeTarget]);
                nextArr.push(str[elem.index + sizeTarget + 1]);
                nextArr.push(str[elem.index + sizeTarget + 2]);
                result[checkStr] = {
                    next: nextArr,
                };
            });
        }
    }
    return checkTwins(result)
}


function checkTwins(obj) {
    const result = {}
    Object.keys(obj).forEach(key => {
        const item = obj[key]
        const flag = item.next.some(i => i !== item.next[0])
        if (!flag) result[key] = item
    })
    return result
}

function removeEmty(data){
    const result = {}
    Object.keys(data).forEach(tickerName => {
        if (Object.keys(data[tickerName].duplicate).length){
            result[tickerName] = data[tickerName]
        }
    })
    return result
}

function setAccros(data){
    const result = {}
    Object.keys(data).forEach(tickerName => {
        const item = data[tickerName];
        const arr = Object.keys(item.duplicate);
        arr.forEach(key => {
            if(!result[key]){
                result[key] = {
                    tickers: [],
                    next: []
                }
            }
            result[key].tickers.push(tickerName)
            result[key].next.push(...item.duplicate[key].next)
        })
    })
    Object.keys(result).forEach(key => {
        if(result[key].tickers.length <=4) delete result[key]
    })
    return result
}

function filterByPercent(data, persent = 0.5){
    Object.keys(data).forEach(key => {
        let diffCount = 0
        const item =  data[key]
        item.next.forEach(i =>{
            if(item.next[0] !== i) diffCount++;
        })
        if(diffCount / item.next.length > persent) delete  data[key]
    })
    return data
}


function removeDownKeys(data){
    Object.keys(data).forEach(key => {
        let zeroCount = 0
        let onceCount = 0
        const item =  data[key]
        item.next.forEach(i =>{
            if( i === '0') zeroCount++;
            if( i === '1') onceCount++;
        })
        if(zeroCount >= onceCount) delete  data[key]
    })
    return data
}
