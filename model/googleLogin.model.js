const mongoose = require('mongoose');
const socialSchema = mongoose.Schema({

    name:{
        type:String
    },
    
    provider:{
        type:String
    },
    email:{
        type:String,
    
    },
    
    date:{
        type:Date,
        default:Date.now
    }

});

module.exports =  mongoose.model("social",socialSchema);