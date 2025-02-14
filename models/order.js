// const mongoose = require('mongoose');
// const { v4: uuidv4 } = require('uuid');

// const OrderSchema = new mongoose.Schema({
//     orderId: { type: String, default: uuidv4 }, // Auto-generate unique Order ID
//     sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true }, // Link with Seller
//     customerName: { type: String, required: true },
//     customerEmail: { type: String, required: true },
//     customerPhone: { type: String, required: true },
//     shippingAddress: {
//         street: { type: String, required: true },
//         city: { type: String, required: true },
//         state: { type: String, required: true },
//         zip: { type: String, required: true },
//         country: { type: String, required: true }
//     },
//     items: [
//         {
//             productId: { type: mongoose.Schema.Types.ObjectId, required: true },
//             productName: { type: String, required: true },
//             quantity: { type: Number, required: true },
//             price: { type: Number, required: true }
//         }
//     ],
//     totalAmount: { type: Number, required: true },
//     orderStatus: { 
//         type: String, 
//         enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], 
//         default: "Pending" 
//     },
//     paymentMethod: { type: String, required: true },
//     createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model("Order", OrderSchema);


const mongoose  = require('mongoose');
const orderSchema = new mongoose.Schema({
customer: {type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    items:[
        {
        product:{type:mongoose.Schema.Types.ObjectId,ref:"Product",required:true},
        seller:{type:mongoose.Schema.Types.ObjectId,ref:"Seller",required:true},
        quantity:{type:Number,required:true,min:1}
        // price:{type:Number,required:true},
        
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