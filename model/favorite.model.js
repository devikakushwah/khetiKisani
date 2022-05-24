const mongoose = require('mongoose');
const favoriteSchema = mongoose.Schema({
     user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"customers"
     },
     tool_id:{
         type:mongoose.Schema.Types.ObjectId,
         ref:"services"
     },
    date:{
        type:Date,
        default:Date.now
    }

});
module.exports = mongoose.model("favorite",favoriteSchema);
