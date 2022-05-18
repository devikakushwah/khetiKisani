const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({

        user: {
            type:mongoose.Schema.Types.ObjectId,
            ref:"customers"
        },
        feedback: {
            type: String
        }
       
    })
    
module.exports = mongoose.model("review",reviewSchema);