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

        res.status(200).json({
            status: 200,
            users: usersArray,
        });
      }
      else
        res.status(404).json({status:404, message:"There no user available"});
  }
  catch(err) {
      res.status(500).json({status:500, message: err.message});
  }
  finally {
      client.close();
  }
};

/**********************************************************/
/*  getUserById: returns a user for a userId
/**********************************************************/
const getUserById = async (req, res) => {
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
/*  getUserByEmail: returns a user for a userId
/**********************************************************/
const getUserByEmail = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    const dbName = "finalProject";

    const {email} = req.params;
  
    console.log("in get users....:", email);
  
    try {
        // connect...
        await client.connect();
        // declare 'db'
        const db = client.db(dbName);
  
        const collections = await db.listCollections().toArray();
        const collectionExists = collections.some(c => c.name === "users");
  
        if (!collectionExists)
            throw new Error('user collection does not exist');
  
      console.log("user", await db.collection("users").findOne({email}));   
      
      const result = await db.collection("users").findOne({email});
  
  
        if (result) {
  
            return res.json({
                status:200, 
                email,
                data: result,
                });
        }
        else
            return res.status(404).json({status:404, email, message:"There is no corresponding user available"});
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

/**********************************************************/
/*  getBoard: returns a list of all boards
/**********************************************************/
const login = async (req, res) => { //login
    // check if user exists
    // if user exists return existing user
    // is user odes not exist create a new user
    const client = new MongoClient(MONGO_URI, options);
    const dbName = "finalProject";

    const body = req.body;

    const {given_name: firstName, family_name: lastName, email, picture} = body;

    console.log(`body = `, req.body);

    try {
        // connect...
        await client.connect();
        // declare 'db'
        const db = client.db(dbName);

        const collections = await db.listCollections().toArray();
        const collectionExists = collections.some(c => c.name === "users");

        if (body && body.email && body.given_name && body.family_name && body.picture != undefined) {

                let dbUser = null;

                if (collectionExists) {
                    console.log("doing find one...");
                    dbUser = await db.collection("users").findOne({email});
                }

                console.log(`dbUser = `, dbUser);

                if (dbUser) {
                    res.status(200).json({status:200, data:dbUser})
                }
                else {
                    const newUser = {_id: uuidv4(), firstName, lastName, email, picture, initials: `${firstName.slice(0,1)}${lastName.slice(0,1)}`, boards:[]}
                    console.log("doing insertOne..."+`${firstName.slice(0,1)}${lastName.slice(0,1)}`) ;
                    const insertResult = await db.collection("users").insertOne(newUser);

                    if (insertResult && insertResult.acknowledged)
                        res.status(200).json({status: 200, data: newUser});
                }
        }
        else
            throw new Error('The body requires email, given_name, family_name and picture fields');

        //check if the user with the provided email already exists
    }
    catch(err) {
        res.status(500).json({status:500, message: err.message});
    }
    finally {
        console.log("closing");
        client.close();
    }
}

module.exports = {
  getUsers,
  getUserById,
  getUserByEmail,
  getBoards,
  getBoard,
  login
};