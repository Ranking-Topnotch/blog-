const mongoose = require('mongoose')
const { Schema, model } = mongoose;
const commentSchema = require('./commentModel');

const blogSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId, 
        required: true
    },
    username: {
        type: String,
        required: true
    },
    title: {
       type: String,
       required: true 
    },
    img: {
        type: String
    },
    profile: {
        type: String
    },
    body: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});

module.exports  = mongoose.models?.Blog || model('Blog', blogSchema )
  