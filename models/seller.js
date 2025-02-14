const mongoose = require('mongoose');
const SellerSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true,unique:true},
    contact:{type:String,required:true,unique:true},
    storename:{type:String,required:true,unique:true},
    address:{type:String,required:true,unique:true},
    isEmailVerified:{type:Boolean,default:false,enum:[true,false]}
})

module.exports=mongoose.model("Seller",SellerSchema);