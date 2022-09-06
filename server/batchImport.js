const  users = require("./data/users.json");

const boards = require("./data/boards.json");

// use this package to generate unique ids: https://www.npmjs.com/package/uuid
// const { v4: uuidv4 } = require("uuid");

const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const collectionExists = async (db, collectionName) => {

  // const collections = await db.listCollections().toArray();
  // return collections.some(c => c.name === collectionName);

  const collection = db.collection(collectionName);

  return !(collection === undefined);
}

const batchImport = async() => {

  const client = new MongoClient(MONGO_URI, options);
  const dbName = "finalProject";

  try {
      // connect...
      await client.connect();
      // declare 'db'
      const db = client.db(dbName);

      try {
          //inserting users
          const insertUsersResult = await db.collection("users").insertMany(users);

          if (insertUsersResult.acknowledged && insertUsersResult.insertedCount > 0)
              console.log(`Status 200, ${insertUsersResult.insertedCount} users inserted!`);
          else
              console.log(`Status 500, insertion of users did not work`);
      }
      catch(err) {
          console.log(`Status 500, users insertion error:${err.message}`);
      }

      try {
          //inserting boards
          const insertBoardsResult = await db.collection("boards").insertMany(boards);

          if (insertBoardsResult.acknowledged && insertBoardsResult.insertedCount > 0)
              console.log(`Status 200, ${insertBoardsResult.insertedCount} boards inserted!`);
          else
              console.log(`Status 500, insertion of boards did not work`);
      }
      catch(err) {
          console.log(`Status 500, boards insertion error:${err.message}`);
      }
  }
  catch(err) {
      console.log(`Status 400, Insertion of users or boards did not work. Error: ${err.message}`);
  }
  finally {
      client.close();
  }
}

batchImport();

