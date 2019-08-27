const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    postId: String,
    username: String,
    imageLink: String,
    date: {type: String, default: Date.now}
})

module.exports = mongoose.model('Post', postSchema)