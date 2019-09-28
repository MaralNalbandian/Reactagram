const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    postId: String,
    username: String,
    imageLink: String,
    date: {type: String, default: Date.now},
    reacts: [{username: String, reaction: String}],
    replies: [{username: String, reply: String}]
})

module.exports = mongoose.model('Post', postSchema)