const time = require("./time");
const settings = require("./settings");

const config = {
  settings,
  db: {
    name: "ib",
    collections: {
      data: { name: "data" },
      splitByTime: { name: "splitByTime" },
      splitData2: { name: "splitdata2005" },
      checkToBuy: { name: "checkToBuy" },
      data2: { name: "data2005" },
      history: { name: "history" },
    },
  },
  server: {
    port: {
      http: process.env.PORT || 4000,
      ws: +process.env.PORT + 1 || 4001
    },
    ready_to_work: true
  },
  time,
};

module.exports = config;
