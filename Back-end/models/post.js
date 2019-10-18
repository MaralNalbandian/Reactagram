const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    postId: String,
    userId: String,
    imageLink: String,
    date: { type: String, default: Date.now },
    reacts: [{ userId: String, reaction: String }],
    numOfReacts: Number,
    replies: [String]
})

module.exports = mongoose.model('Post', postSchema)