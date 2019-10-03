const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    postId: String,
    userId: String,
    imageLink: String,
    date: {type: String, default: Date.now},
    reacts: Array,
    replies: Array
})

module.exports = mongoose.model('Post', postSchema)