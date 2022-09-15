"use strict";

// import the needed node_modules.
const express = require("express");
const morgan = require("morgan");

const {
    getUsers,
    getUserById,
    getUserByEmail,
    getBoards,
    getBoard,
    getBoardsForUser,
    login,
    createBoard,
    updateBoard
} = require("./handlers");


express()
    // Below are methods that are included in express(). We chain them for convenience.
    // --------------------------------------------------------------------------------

    // This will give us will log more info to the console. see https://www.npmjs.com/package/morgan
    .use(morgan("tiny"))
    .use(express.json())

    // Any requests for static files will go into the public folder
    .use(express.static("public"))

    // Nothing to modify above this line
    // ---------------------------------
    
    .get("/api/get-users", getUsers)
    .get("/api/get-user-by-id/:_id", getUserById)
    .get("/api/get-user-by-email/:email", getUserByEmail)
    .get("/api/get-boards", getBoards)
    .get("/api/get-board/:_id", getBoard)
    .get("/api/get-boards-for-user/:userId", getBoardsForUser)
    .post("/api/add-user", login)
    .post("/api/add-board", createBoard)
    .put("/api/update-board", updateBoard)


      // ---------------------------------
    // Nothing to modify below this line

    // this is our catch all endpoint.
    .get("*", (req, res) => {
      res.status(404).json({
      status: 404,
      message: "This is obviously not what you are looking for.",
      });
  })

    // Node spins up our server and sets it to listen on port 8000.
    .listen(8000, () => console.log(`Listening on port 8000`));