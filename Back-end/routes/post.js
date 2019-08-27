const express = require('express');
const router = express.Router();

const Post = require('../models/post')

// POST /api/post/add
// Create post
router.post('/add', async (req,res) => {
    const postId = req.body.postId;
    const username = req.body.username;
    const imageLink = req.body.imageLink;

    try{
        post = new Post({
            postId,
            username,
            imageLink,
            date: new Date()
        });

        await post.save();

        res.json(post);

    } catch(err){
        console.error(err);
        res.status(500).json('Server error')
    }
})

// GET /api/post/get/:id
// Get post by ID
router.get('/get/:id', async (req,res) => {
    try {
        const post = await Post.findOne({ postId: req.params.id })

        if(post) {
            return res.json(post)
        } else {
            res.status(404).json('No post found');
        }
    } catch(err) {
        console.error(err);
        res.status(500).json('Server error');
    }
});

// GET /api/post/all
// Get all posts
router.get('/all', async (req,res) => {
    try {
        const posts = await Post.find({})

        if(posts) {
            return res.json(posts)
        } else {
            res.status(404).json('No posts found');
        }
    } catch(err) {
        console.error(err);
        res.status(500).json('Server error');
    }
});

module.exports = router;