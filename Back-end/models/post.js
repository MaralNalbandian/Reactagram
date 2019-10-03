const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    postId: String,
    userId: String,
    imageLink: String,
<<<<<<< HEAD
    date: {type: String, default: Date.now},
    reacts: Array,
    replies: Array
=======
    date: { type: String, default: Date.now },
    reacts: [{ userId: String, reaction: String }],
    replies: [{ userId: String, reply: String }]
>>>>>>> develop
})

module.exports = mongoose.model('Post', postSchema)