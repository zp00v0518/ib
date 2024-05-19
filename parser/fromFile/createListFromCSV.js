// перелік S&P_500 з розбивкою по рокам отримав тут - https://github.com/fja05680/sp500.git
const fs = require("fs");
const path = require("path");
const filePath = "S&P_500_Historical_Components_Changes(04-08-2024).csv";
const writeFileNameAllStocks = 's&p500_ally_year.json'
const writeFileNameByYear = 's&p500_by_year.json'

function createListFromCSV() {
    const currPath = path.resolve(__dirname, filePath);
    const file = fs.readFileSync(currPath).toLocaleString();
    // const file = fs.readFileSync(currPath, 'utf-8');

    const rows = file.split("\n");
    const tickersList = [];
    const tickersListByYear = {}

    rows.forEach((row, index) => {
        if (index === 0) return;
        const columns = row.split('"');
        if (columns.length <= 1) return;
        let tickers = []
        tickers = columns[1].split(",");
        tickersList.push(...tickers);
        const dateTime = new Date(columns[0]).getTime() / 1000
        tickersListByYear[dateTime] = {
            arr: [...tickers],
            date: columns[0]
        }
    });
    const clearArr = new Set(tickersList)
    const result = []
    clearArr.forEach(tickerName => {
        result.push({s: tickerName})
    })
    console.log("***************");
    const writePath = path.resolve(__dirname, './' + writeFileNameAllStocks);
    const writePathByYear = path.resolve(__dirname, './' + writeFileNameByYear);
    fs.writeFileSync(writePath, JSON.stringify(result))
    fs.writeFileSync(writePathByYear, JSON.stringify(tickersListByYear))

}

createListFromCSV();
