"use strict";

// use this package to generate unique ids: https://www.npmjs.com/package/uuid
const { v4: uuidv4 } = require("uuid");

const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

// use this data. Changes will persist until the server (backend) restarts.
// const { users} = require("./data/users.json");
// const { boards} = require("./data/boards.json");
const { restart } = require("nodemon");

/**********************************************************/
/*  getUsers: returns a list of all users
/**********************************************************/
const getUsers = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const dbName = "finalProject";

  console.log("in get users....");

  try {
      // connect...
      await client.connect();
      // declare 'db'
      const db = client.db(dbName);

      const collections = await db.listCollections().toArray();
      const collectionExists = collections.some(c => c.name === "users");

      if (!collectionExists)
          throw new Error('user collection does not exist');

    console.log("users", await db.collection("users").find().toArray());   
    
    const usersArray = await db.collection("users").find().toArray();

    //   const usersArray =  ((await db.collection("users").find().toArray()).map(aUser => {
    //       const {user} = aUser;
    //       return {user};
    //   }));

      if (usersArray.length > 0) {

        return res.status(200).json({
            status: 200,
            users: usersArray,
        });
      }
      else
        return res.status(404).json({status:404, message:"There no user available"});
  }
  catch(err) {
      return res.status(500).json({status:500, message: err.message});
  }
  finally {
      client.close();
  }
};

/**********************************************************/
/*  getUser: returns a user for a userId
/**********************************************************/
const getUser = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    const dbName = "finalProject";

    const {_id} = req.params;
  
    console.log("in get users....:", _id);
  
    try {
        // connect...
        await client.connect();
        // declare 'db'
        const db = client.db(dbName);
  
        const collections = await db.listCollections().toArray();
        const collectionExists = collections.some(c => c.name === "users");
  
        if (!collectionExists)
            throw new Error('user collection does not exist');
  
      console.log("user", await db.collection("users").findOne({_id}));   
      
      const result = await db.collection("users").findOne({_id});
  
  
        if (result) {
  
            return res.json({
                status:200, 
                _id,
                data: result,
                });
        }
        else
            return res.status(404).json({status:404, _id, message:"There isno user available"});
    }
    catch(err) {
        return res.status(500).json({status:500, message: err.message});
    }
    finally {
        client.close();
    }
  };

/**********************************************************/
/*  getBoards: returns a list of all boards
/**********************************************************/
const getBoards = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const dbName = "finalProject";

  try {
      // connect...
      await client.connect();
      // declare 'db'
      const db = client.db(dbName);

      const collections = await db.listCollections().toArray();
      const collectionExists = collections.some(c => c.name === "boards");

      if (!collectionExists)
          throw new Error('boards collection does not exist');

    const boardsArray =  await db.collection("boards").find().toArray();

    //   const boardsArray =  ((await db.collection("boards").find().toArray()).map(aBoard => {
    //       const {board} = aBoard;
    //       return {board};
    //   }));

      if (boardsArray.length > 0) {

          return res.json({
              boards: boardsArray,
              });
      }
      else
          return res.status(404).json({status:404, message:"There is no board available"});
  }
  catch(err) {
      return res.status(500).json({status:500, message: err.message});
  }
  finally {
      client.close();
  }
};

/**********************************************************/
/*  getBoard: returns a list of all boards
/**********************************************************/
const getBoard = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    const dbName = "finalProject";
    const {_id} = req.params;

    try {
        // connect...
        await client.connect();
        // declare 'db'
        const db = client.db(dbName);

        const collections = await db.listCollections().toArray();
        const collectionExists = collections.some(c => c.name === "boards");

        if (!collectionExists)
            throw new Error('boards collection does not exist');

        const result = await db.collection("boards").findOne({_id});

        if (result) {
            return res.status(200).json({
                status: 200,
                _id,
                board: result
            });
        }
        else {
            return res.status(400).json({
                status: 400,
                message: `There is no board available with _id: ${_id}`
            })
        }
    }
    catch(err) {
        console.error("error", err.message);
        return res.status(500).json({
            status: 500,
            message: err.message    
        })
    }
    finally {
        client.close();
    }
};

module.exports = {
  getUsers,
  getUser,
  getBoards,
  getBoard
};