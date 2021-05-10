const time = require("./time");

const config = {
  db: {
    name: "ib",
    collections: {
      data: { name: "data" },
      splitByTime: { name: "splitByTime" },
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
