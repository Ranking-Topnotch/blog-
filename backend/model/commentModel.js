const mongoose = require('mongoose')
const { Schema, model } = mongoose;

const commentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    blogId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    content: {
        type: String,
        required: true 
    }
});

module.exports  = mongoose.models?.Comment || model('Comment', commentSchema )


// userId: {
//     type: Schema.Types.ObjectId,
//     required: true
// },
// username: {
//     type: String,
//     required: true
// },
// blogId: {
//     type: Schema.Types.ObjectId,
//     ref: 'Blog',
//     required: true
// },
// content: {
//     type: String,
//     required: true 
// }