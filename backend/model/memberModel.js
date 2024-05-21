const mongoose = require('mongoose')
const { Schema, model } = mongoose;

const memberSchema = new Schema({
    img: {
        type: String,
        public_id: String,
        url: String
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: function() {
            return !this.isSigningInWithGoogle;
        }
    },
    verified: {
        type: Boolean,
        required: function() {
            return !this.isSigningInWithGoogle;
        }
    },
    isSigningInWithGoogle: {
        type: Boolean,
        default: false
    },
    about: {
        type: String
    },
    role: {
        type: String
    },
    link: {
        type: String
    },
    address: {
        type: String
    },

})

memberSchema.methods.signInWithGoogle = function() {
    this.isSigningInWithGoogle = true;
};

module.exports  = mongoose.models?.Member || model('Member', memberSchema )