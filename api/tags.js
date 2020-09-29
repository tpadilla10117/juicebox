
    // we use Router function to create a new router, & then export it from the script
    const express = require('express');
    const tagsRouter = express.Router();
    const { getAllTags } = require('../db');
    const { getPostsByTagName } = require('../db');
    
    tagsRouter.use((req, res, next) => {
      console.log("A request is being made to /tags");
    
      /* res.send({ message: 'hello from /tags!' }); */
      next();
    });
    
    tagsRouter.get('/', async (req, res) => {
        const tags = await getAllTags();
      
        res.send({
          tags
        });
      });

      tagsRouter.get('/:tagName/posts', async (req, res, next) => {
        // read the tagname from the params
        const { tagName } = req.params;
        try {
          // use our method to get posts by tag name from the db
          const post = await getPostsByTagName(tagName);
          // send out an object to the client { posts: // the posts }
          //keep a post if it is either active, or if it belings to current user
          const tags = post.filter(post => {
          return post.active || (req.user && post.author.id === req.user.id);
        });
          res.send({ tags});
        } catch ({ name, message }) {
          // forward the name and message to the error handler
          next({ name, message })
        }
      });
    
    module.exports = tagsRouter;