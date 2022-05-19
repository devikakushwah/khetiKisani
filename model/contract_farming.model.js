const { booleanParser } = require('config/parser');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const contractSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"customers"
    },
    name: {
        type: String,
    
    },
    mobile: {
        type: String,
    },
    image: {
        type: String,
    
    },
    Area: {
        type: String,
    
    },
    email:{
        type: String,
        required:true
    },
    verification: {
        type: Boolean,
        default: false
    },
    duration: {
        type: String,
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        required:true
    },
    reviews: [{
     user: {
         type:mongoose.Schema.Types.ObjectId,
         ref:"customers"
     },
     feedback: {
         type: String
     }
    }],
    date: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model("contracts", contractSchema);