const ConnectMongoDB = require('./connectMongoDB.js');

const mongo = new ConnectMongoDB();

class DeleteInDB {
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

  async one(collectionName = 'test', query) {
    if(!query){
      console.log('Cannot delete. Pass filter document');
      return;
    }
    const collection = this.mongo.open(collectionName);
    const result = await collection.deleteOne(query);
    return result;
  }

  async all(collectionName = 'test', query) {
    if(!query){
      console.log('Cannot delete. Pass filter document');
      return;
    }
    const collection = this.mongo.open(collectionName);
    const result = await collection.deleteMany(query)
    return result;
  }

}

module.exports = DeleteInDB;