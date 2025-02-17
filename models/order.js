const mongoose  = require('mongoose');
const orderSchema = new mongoose.Schema({
customer: {type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    items:[
        {
        product:{type:mongoose.Schema.Types.ObjectId,ref:"Product",required:true},
        seller:{type:mongoose.Schema.Types.ObjectId,ref:"Seller",required:true},
        quantity:{type:Number,required:true,min:1}
        
        
    }
    ],
    totalAmount:{type:Number,required:true},
    status:{
        type:String,
        enum:["Pending","Processing","Shipped","Delivered","Cancelled"],
        default:"Pending"
    },
    paymentMethod:{
        type:String,
        enum:["Cash On Delivery","Online Payment"],
        required:true
    },
    paymentStatus:{
        type:String,
        enum:["Pending","Paid"],
        default:"Pending",
        required:true
    },
    address:{
        type:String,
        required:true
    },
    orderAt:{
        type:Date,
        default:Date.now
    }
});

module.exports=mongoose.model("Order",orderSchema);