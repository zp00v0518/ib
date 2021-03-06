const ConnectMongoDB = require("./connectMongoDB.js");

const mongo = new ConnectMongoDB();

class FindInDB {
  constructor(mongoInstance = mongo) {
    this.mongo = mongoInstance;
    this.dbName = null;
    this.isReady = false;
  }

  close() {
    this.mongo.close();
  }

  async connect(dbName) {
    this.dbName = dbName;
    const result = await this.mongo.connect({ dbName });
    this.isReady = true;
    return result;
  }

  async one(collectionName = "test", options = {}) {
    const collection = this.mongo.open(collectionName);
    const needFields = options.needFields || null;
    const query = options.query || null;
    const skip = options.skip || null;
    const result = await collection.findOne(query, {
      projection: needFields,
      skip,
    });
    return result;
  }

  async all(collectionName = "test", query = {}, options = {}) {
    const collection = this.mongo.open(collectionName);
    const sort = options.sort || 0;
    const limit = options.limit || 0;
    const skip = options.skip || 0;
    const needFields = options.needFields || null;
    const comment = options.comment || null;
    const itog = await collection
      .find(query, {
        projection: needFields,
        sort,
        skip,
        limit,
        comment,
      })
      .toArray();

    const findResult = {
      result: itog,
      sort,
      limit,
      skip,
    };
    return findResult;
  }
  async distinct(collectionName = "test", field = "_id") {
    const collection = this.mongo.open(collectionName);
    const result = await collection.distinct(field);
    return result;
  }
  async count(collectionName, query = null) {
    let collection = this.mongo.open(collectionName);
    const count = await collection.countDocuments(query);
    return count;
  }
}

module.exports = FindInDB;
// module.exports = FindInDB;
