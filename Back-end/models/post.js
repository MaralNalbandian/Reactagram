const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    postId: String,
    username: String,
    imageLink: String,
    date: { type: String, default: Date.now },
    reacts: [{ userId: String, reaction: String }],
    replies: [{ userId: String, reply: String }]
})

module.exports = mongoose.model('Post', postSchema)