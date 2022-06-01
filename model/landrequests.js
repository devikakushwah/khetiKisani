const mongoose = require('mongoose');
const requestSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"customers"
    },
    contractId:{
        types: mongoose.Schema.Types.ObjectId,
        ref:"contracts"
    },
    isAccepted:{
        type: boolean,
        default:false
    },
    date:{
        type:Date,
        default: Date.now
    }
})

module.exports = mongoose.model("landrequests",requestSchema);