const InsertDB = require('./InsertDB');
const UpdateDB = require('./UpdateDB');
const FindInDB = require('./FindInDB');
const AggregateDB = require('./AggregateDB');
const BulkWriteDB = require('./BulkWriteDB');
const DeleteInDB = require('./DeleteInDB');
const connectMongoDB = require('./connectMongoDB');

module.exports = {
  InsertDB,
  UpdateDB,
  FindInDB,
  AggregateDB,
  BulkWriteDB,
  connectMongoDB,
  DeleteInDB
};
