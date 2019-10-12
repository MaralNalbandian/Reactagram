const express = require('express');
const router = express.Router();

const Post = require('../models/post')

// POST /api/post/add
// Create post
router.post('/add', async (req, res) => {
    const postId = req.body.postId;
    const userId = req.body.userId;
    const imageLink = req.body.imageLink;

    try {
        post = new Post({
            postId,
            userId,
            imageLink,
            date: new Date(),
            reacts: [],
            numOfReacts: 0,
            replies: []
        });

        await post.save();

        res.json(post);

    } catch (err) {
        console.error(err);
        res.status(500).json('Server error')
    }
})

// GET /api/post/get/:id
// Get post by ID
router.get('/get/:id', async (req, res) => {
    try {
        const post = await Post.findOne({ postId: req.params.id })

        if (post) {
            return res.json(post)
        } else {
            res.status(404).json('No post found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
    }
});

// GET /api/post/all
// Get all posts
router.get('/all', async (res) => {
    try {
        const posts = await Post.find({})

        if (posts) {
            return res.json(posts)
        } else {
            res.status(404).json('No posts found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
    }
});

// GET /api/post/page/:page
// Get posts on a certain page
router.get('/page/:page', async (req,res) => {
    try {
        //This is the first post to be shown on the page
        const startRange = (req.params.page - 1) * 9;
        //Posts are sorted by number of reacts and then finds the 9 posts that correspond to the page the user is on
        const posts = await Post.find({}).sort({numOfReacts : -1}).skip(startRange).limit(9)

        if(posts) {
            return res.json(posts)
        } else {
            res.status(404).json('No posts found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
    }
});

// GET /api/post/count
// Get a count of how many posts are in the system - this is used to calculate how many pages will need to be displayed
router.get('/count', async (req,res) => {
    try {
        const amount = await Post.find({}).countDocuments()

        if(amount) {
            return res.json(amount)
        } else {
            res.status(404).json('No amount found');
        }
    } catch(err) {
        console.error(err);
        res.status(500).json('Server error');
    }
});

// POST /api/post/react
// React to a post
router.post('/react', async (req, res) => {
    try {
        const post = await Post.findOne({ postId: req.body.postId })

        if (post) { //if post exists based on id
            try {
                post.reacts = req.body.reacts;
                post.numOfReacts = req.body.numOfReacts;

                await post.save();
            } catch (error) {
                res.status(500).json(error)
            }
        }

        else {
            res.status(404).json('No post found');
        }

    } catch (err) {
        console.error(err);
        res.status(500).json('Server error')
    }
});


// POST /api/post/reply
// React to a post
router.post('/reply', async (req, res) => {
    try {
        const post = await Post.findOne({ postId: req.body.postId })

        if (post) { //if post exists based on id
            try {
                post.replies = req.body.replies;

                await post.save();
            } catch (error) {
                res.status(500).json(error)
            }
        }

        else {
            res.status(404).json('No post found');
        }

    } catch (err) {
        console.error(err);
        res.status(500).json('Server error')
    }
});


// POST /api/post/delete
// React to a post
router.delete('/delete', async (req, res) => {
    try {
        const post = await Post.findOne({ postId: req.body.postId })

        if (post) { //if post exists based on id
            try {
                post.remove();
                
                await post.save();
            } catch (error) {
                res.status(500).json(error)
            }
        }

        else {
            res.status(404).json('No post found');
        }

    } catch (err) {
        console.error(err);
        res.status(500).json('Server error')
    }
});

module.exports = router;