const mongoose = require('mongoose')

const UserModel = mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
            unique: true
        },
        Password: {
            type: String
        },
        Question: {
            type: String
        },
        Answer: {
            type: String,
            trim: true
        },
        ProfilePic: {
            type: String
        },
        Posts: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            default: []
        }]
    },
    {
        collection: 'Users'
    }
)

const User = mongoose.model("Users", UserModel)

module.exports = User

