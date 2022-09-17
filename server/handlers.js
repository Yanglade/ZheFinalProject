"use strict";

// use this package to generate unique ids: https://www.npmjs.com/package/uuid
const { v4: uuidv4 } = require("uuid");

const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const fetch = require("node-fetch");

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

      if (boardsArray.length > 0) {

          return res.status(200).json({
              status:200,
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
/*  getBoardsForUser: returns boards accessible for a given user
/**********************************************************/
const getBoardsForUser = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    const dbName = "finalProject";
    const {userId} = req.params;

    console.log(`getBoardsForUser param: userId = `, userId);

    try {
        // connect...
        await client.connect();
        // declare 'db'
        const db = client.db(dbName);
  
        const collections = await db.listCollections().toArray();
        const boardsCollectionExists = collections.some(c => c.name === "boards");
        const usersCollectionExists = collections.some(c => c.name === "users");
  
        if (!boardsCollectionExists)
            throw new Error('boards collection does not exist');

        if (!usersCollectionExists)
            throw new Error('users collection does not exist');

        const user = await db.collection("users").findOne({_id: userId});

        if (user) {

            const userBoardsIdsArr = user.boards;

            console.log(`getBoardsForUser...user = `, user);

            console.log(`getBoardsForUser...userBoardsIdsArr = `, userBoardsIdsArr);

            const userBoardsArr = await db.collection("boards").find({_id: { $in: userBoardsIdsArr}}).toArray();

            // console.log(`getBoardsForUser...userBoardsArr = `, userBoardsArr);

            if (userBoardsArr) {

                return await res.status(200).json({
                    status: 200,
                    _id: userId,
                    boards: userBoardsArr
                });
            }
            else {
                return await res.status(400).json({
                    status: 400,
                    message: "Cannot find boards that are accessible to this user"
                })
            }
        }
        else {
            return res.status(400).json({
                status: 400,
                message: `There is no user available with _id: ${userId}`
            })
        }
  
    }
    catch(err) {
        return res.status(500).json({status:500, message: err.message});
    }
    finally {
        client.close();
    }
  };

/**********************************************************/
/*  login: returns a list of all boards
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
                    console.log(`login...dbUser = `, dbUser)
                    return res.status(200).json({status:200, data:dbUser})
                }
                else {
                    const newUser = {_id: uuidv4(), firstName, lastName, email, picture, initials: `${firstName.slice(0,1)}${lastName.slice(0,1)}`, boards:[]}
                    console.log("doing insertOne..."+`${firstName.slice(0,1)}${lastName.slice(0,1)}`) ;
                    const insertResult = await db.collection("users").insertOne(newUser);

                    if (insertResult && insertResult.acknowledged)
                        return res.status(200).json({status: 200, data: newUser});
                }
        }
        else
            throw new Error('The body requires email, given_name, family_name and picture fields');

        //check if the user with the provided email already exists
    }
    catch(err) {
        return res.status(500).json({status:500, message: err.message});
    }
    finally {
        console.log("closing");
        client.close();
    }
}

/**********************************************************/
/*  createBoard: returns a list of all boards
/**********************************************************/
const createBoard = async (req, res) => {
    // check if user exists
    // if user exists return existing user
    // is user odes not exist create a new user
    const client = new MongoClient(MONGO_URI, options);
    const dbName = "finalProject";

    const aBoard = req.body;

    const {tasks, columns, columnOrder, userIdsWithAccess, boardName} = aBoard;

    console.log(`createBoard...aBoard = `, aBoard);

    try {
        // connect...
        await client.connect();
        // declare 'db'
        const db = client.db(dbName);
        let boardCount = 0;
        let newBoard;
        let boardId = 1;

        if (tasks && columns && columnOrder, userIdsWithAccess) {

            const collections = await db.listCollections().toArray();
            const boardsCollectionExists = collections.some(c => c.name === "boards");
            const usersCollectionExists = collections.some(c => c.name === "users");

            //check number of boards if collection exists
            if (boardsCollectionExists) {
                boardCount = await db.collection("boards").countDocuments();
                console.log(`createBoard...boardCount = `, boardCount);
                boardId = boardCount + 1;
                console.log(`createBoard...boardId = `, boardId);
            }

            if (!boardName) {

                newBoard = {_id: `${boardId}`, ...aBoard, boardName: `Board-${boardId}`}
            }
            else {
                newBoard = {...aBoard, _id: `${boardId}`};
            }

            //insert the new board
            console.log(`newBoard...before insert = `, newBoard);
            const insertBoardResult = await db.collection("boards").insertOne(newBoard);

            if (insertBoardResult && insertBoardResult.acknowledged) {
                
                //update user to add new board
                if (usersCollectionExists) {
                    const boardUserId = `${userIdsWithAccess[0]}`;
                    console.log(`boardUserId = `, boardUserId);
                    const boardUser = await db.collection("users").findOne({_id: boardUserId});
                    console.log(`boardUser = `, boardUser);
                    console.log(`boardUser.boards = `, boardUser.boards);
                    
                    if (boardUser) {
                        const updatedBoardsArr = [...boardUser.boards, `${boardId}`];
                        const updateResult = await db.collection("users").updateOne({_id: `${userIdsWithAccess[0]}`}, {$set:{boards: updatedBoardsArr}});
                        
                        if (!updateResult || !updateResult.modifiedCount)
                            throw new Error("Board added but user not updated");
                    }
                }

                return await res.status(200).json({status: 200, data: newBoard});
            }
            else {
                return await res.status(500).json({status: 500, message: "The new board could not be added properly"})
            }

        }
        else {
            throw new Error('The body requires tasks, columns, columnOrderfields, userIdsWithAccess'); 
        }
    }
    catch(err) {
        console.error("err =", err);
        return res.status(500).json({
            status: 500,
            message: err.message
        });
    }
    finally {
        console.log("closing");
        client.close();
    }
}

/**********************************************************/
/*  updateBoard: returns a list of all boards
/**********************************************************/
const updateBoard = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    const dbName = "finalProject";

    const aBoard = req.body;

    // console.log(`aBoard = `, aBoard);
    console.log(`upateBoard:... aBoard._id = `, aBoard._id)

    const {tasks, columns, columnOrder, userIdsWithAccess, boardName} = aBoard;

    try {
        // connect...
        await client.connect();
        // declare 'db'
        const db = client.db(dbName);

        const collections = await db.listCollections().toArray();
        const boardsCollectionExists = collections.some(c => c.name === "boards");
        const usersCollectionExists = collections.some(c => c.name === "users");

        if (boardsCollectionExists) {
            const updateBoardResult = await db.collection("boards").updateOne({_id: `${aBoard._id}`}, {$set:{...aBoard}});

            if (updateBoardResult && updateBoardResult.modifiedCount) {
                return await res.status(200).json({status:200, board: aBoard});
            }
        }
    }
    catch(err) {
        console.log(err.message);
        return res.status(500).json({status:500, message:err.message});
    }
    finally {
        client.close();
    }
}

const getGeekJoke = async () => {
    // ha hahahh
    try {
      const response = await fetch("https://v2.jokeapi.dev/joke/Programming?format=json&type=single&blacklist=nsfw,racist,sexist,explicit");
      const parsedResponse = await JSON.parse(response);
      //console.log(parsedResponse);
      return parsedResponse.joke;
    }
    catch(err) {
      console.log(err);
    }
  };

const getAdvice = async () => {
    // ha hahahh
    try {
        const response = await fetch("https://api.adviceslip.com/daily_adviceslip.rss");
        const parsedResponse = await JSON.parse(response);
        console.log(parsedResponse);
        return res.status(200).json({status:200, data: parsedResponse});
    }
    catch(err) {
        console.log(err);
    }
};

const getZen = async (req, res) => {
    try {
        const response = await fetch("https://zenquotes.io/api/random/3");
        const parsedResponse = await response.json();
        console.log("parsedResponse....", parsedResponse);
        // return parsedResponse;
        return await res.status(200).json({status:200, data: parsedResponse});
    }
    catch(err) {
    console.log(err);
    }
};



module.exports = {
  getUsers,
  getUserById,
  getUserByEmail,
  getBoards,
  getBoard,
  getBoardsForUser,
  login,
  createBoard,
  updateBoard,
  getGeekJoke,
  getAdvice,
  getZen
};