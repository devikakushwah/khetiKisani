const mongoose = require('mongoose');
const storageSchema = new mongoose.Schema({

   storageId:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"categories"
   },
   capacity:{
       type:String
   },
   location:{
       type:String
   },
   
   isAvailable: {
    type: Boolean

   },
   images:{
    type:String,
   },
   video:{
    type:String,
   },
   name:{
       type:String
   },
   duration:{
       type:String
   },
   storage_description: {
    type: String,
   },
   items: [{
    name: {
        type: String,
    },
    charges: {
        type: Number,
    },
    description: {
        type: String,
    },
    temperature:{
        type: String,
    },
    weight:{
        type:Number
    },
    durationNo:{
        type:Number
    },
    durationDay:{
        type:String
    }

   }],
  
   reviews: [{
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"customers"
    },
    feedback: {
        type: String
    }
   }],
   

});

module.exports = mongoose.model("storages",storageSchema);