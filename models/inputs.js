var mongoose = require("mongoose");
var NoticeSchema=new mongoose.Schema({
    name:String,
    love:String,
    paid:String,
    need:String,
    good:String,
    secretKey:String,
    
    created:{type:Date,default:Date.now}

})

module.exports=mongoose.model("Notices",NoticeSchema)