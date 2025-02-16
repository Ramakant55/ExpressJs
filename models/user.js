const mongoose=require("mongoose");

const UserSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true,unique:true},
    dob:{type:Date,required:true},
    phone:{type:String,required:true,unique:true},
    orders:[{type:mongoose.Schema.Types.ObjectId,ref:"Order"}],
    isEmailVerified:{type:Boolean,default:false,enum:[true,false]}
})


module.exports=mongoose.model("User",UserSchema);