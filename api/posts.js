
    // we use Router function to create a new router, & then export it from the script
    const express = require('express');
    const postsRouter = express.Router();
    const { getAllPosts } = require('../db');
    
    postsRouter.use((req, res, next) => {
      console.log("A request is being made to /posts");
    
      /* res.send({ message: 'hello from /users!' }); */
      next();
    });
    
    postsRouter.get('/', async (req, res) => {
        const posts = await getAllPosts();
      
        res.send({
          posts
        });
      });
    
    module.exports = postsRouter;