const mongoose = require('mongoose');
//postId
    //Unique identifier for the post
//userId
    //Id of the user who created the post
//imageLink
    //Link to S3 where the image has been uploaded
//date
    //Date and time when the post was created
//reacts
    //An array of reacts associated with the post
    //e.g. [{userId:'5d9bad59723259218c17b5f8', reaction:'sad'}, {userId:'5d9baf43723259218c17b5ff', reaction:'laugh'}]
//numOfReacts
    //A count of how many reactions there are for the post.
//replies
    //An array of references to reply posts
    //e.g. ['post1570483744368', 'post1570484097633', 'post1570484122317']
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