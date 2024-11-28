const mongoose = require('mongoose')

const PostModel = mongoose.Schema(
    {
        Image: {
            type: String,
            require: true
        },
        Caption: {
            type: String,
            trim: true
        },
        Auther: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            require: true
        },
        Likes: {
            type: Number,
            require: true,
            default: 0
        },
        UserWhoLikes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }]
    },
    {
        collection: "Posts"
    }
)

const Post = mongoose.model("Post", PostModel)

module.exports = Post

