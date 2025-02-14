
const  mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    imageurl: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    seller: { type:String,required:true }  //jo seller bech rha h uski id
},{timestamps:true});
module.exports = mongoose.model('Product', ProductSchema);