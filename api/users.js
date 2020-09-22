// api/users.js

    // we use Router function to create a new router, & then export it from the script
const express = require('express');
const usersRouter = express.Router();
const { getAllUsers } = require('../db');

usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users");

  /* res.send({ message: 'hello from /users!' }); */
  next();
});

usersRouter.get('/', async (req, res) => {
    const users = await getAllUsers();
  
    res.send({
      users
    });
  });

module.exports = usersRouter;