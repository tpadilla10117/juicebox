
    // we use Router function to create a new router, & then export it from the script
    const express = require('express');
    const postsRouter = express.Router();
    const { getAllPosts } = require('../db');
    const { requireUser } = require('./utils');
    const { createPost } = require('../db');
    const { updatePost } = require('../db');
    const { getPostById }= require('../db');
    
    postsRouter.use((req, res, next) => {
      console.log("A request is being made to /posts");
    
      /* res.send({ message: 'hello from /users!' }); */
      next();
    });

    postsRouter.post('/', requireUser, async (req, res, next) => {
      const { title, content, tags = "" } = req.body;
    
      const tagArr = tags.trim().split(/\s+/)
      const postData = {};
      // only send the tags if there are some to send
      if (tagArr.length) {
        postData.tags = tagArr;
      }
    
      try {
        // add authorId, title, content to postData object
        postData.authorId = req.user.id;
        postData.title = title;
        postData.content = content;
        // this will create the post and the tags for us
        const post = await createPost(postData);
        if (post) {
          res.send({ post });
        } else {
          next();
        }
        // if the post comes back, res.send({ post });
        // otherwise, next an appropriate error object 
      } catch ({ name, message }) {
        next('Not Authorized');
      }
    });

    /* postsRouter.post('/', requireUser, async (req, res, next) => {
      res.send({ message: 'under construction' });
    }); */
    
    postsRouter.get('/', async (req, res) => {
      try {
        const allPosts = await getAllPosts();
        //keep a post if it is either active, or if it belings to current user
        const posts = allPosts.filter(post => {
          return post.active || (req.user && post.author.id === req.user.id);
        });
        res.send({
          posts
        });
      } catch ({ name, message }) {
        next({ name, message });
      }
      });



/* THIS IS WHERE WE HAVE OUR PATCH ROUTER */

postsRouter.patch('/:postId', requireUser, async (req, res, next) => {
  const { postId } = req.params;
  const { title, content, tags } = req.body;

  const updateFields = {};

  if (tags && tags.length > 0) {
    updateFields.tags = tags.trim().split(/\s+/);
  }

  if (title) {
    updateFields.title = title;
  }

  if (content) {
    updateFields.content = content;
  }

  try {
    const originalPost = await getPostById(postId);

    if (originalPost.author.id === req.user.id) {
      const updatedPost = await updatePost(postId, updateFields);
      res.send({ post: updatedPost })
    } else {
      next({
        name: 'UnauthorizedUserError',
        message: 'You cannot update a post that is not yours'
      })
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

/* THIS IS OUR DELETE ROUTER */

postsRouter.delete('/:postId', requireUser, async (req, res, next) => {
  try {
    const post = await getPostById(req.params.postId);

    if (post && post.author.id === req.user.id) {
      const updatedPost = await updatePost(post.id, { active: false });

      res.send({ post: updatedPost });
    } else {
      // if there was a post, throw UnauthorizedUserError, otherwise throw PostNotFoundError
      next(post ? { 
        name: "UnauthorizedUserError",
        message: "You cannot delete a post which is not yours"
      } : {
        name: "PostNotFoundError",
        message: "That post does not exist"
      });
    }

  } catch ({ name, message }) {
    next({ name, message })
  }
});
    
    module.exports = postsRouter;