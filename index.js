// inside index.js
const PORT = 3000;
const express = require('express');
const server = express();
const { client } = require('./db');
client.connect();

server.listen(PORT, () => {
  console.log('The server is up on port', PORT)
});

//bodyParser.json() reads incoming JSON requests
const bodyParser = require('body-parser');
server.use(bodyParser.json());

//this logs out incoming requests like: EG. GET /api/users 304 19.825 ms - -
const morgan = require('morgan');
server.use(morgan('dev'));

server.use((req, res, next) => {
    console.log("<____Body Logger START____>");
    console.log(req.body);
    console.log("<_____Body Logger END_____>");
  
    next();
  });

const apiRouter = require('./api');
server.use('/api', apiRouter);
