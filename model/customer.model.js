const mongoose = require('mongoose');
const customerSchema = mongoose.Schema({

    name:{
        type:String
    },
    mobile:{
        type:String
    },
    address:{
        type:String
    },
    provider:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String
    },
    occupation:{
        type:String
    },
    image:{
       type:String
    },
    date:{
        type:Date,
        default:Date.now
    }

});

module.exports =  mongoose.model("customers",customerSchema);