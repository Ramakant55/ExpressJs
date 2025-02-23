const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    originalPrice: {
        type: Number,
        required: true
    },
    category: { 
        type: String, 
        required: true 
    },
    subCategory: {
        type: String,
        required: true
    },
    imageurl: { 
        type: String, 
        required: true 
    },
    quantity: { 
        type: Number, 
        required: true,
        default: 0
    },
    seller: { 
        type: String,
        required: true 
    },
    ratings: {
        type: Number,
        default: 0
    },
    sizes: [{
        type: String
    }],
    tags: [{
        type: String
    }],
    isBestSeller: {
        type: Boolean,
        default: false
    },
    inStock: {
        type: Boolean,
        default: true
    },
    unitsSold: {
        type: Number,
        default: 0
    },
    reviews: [{
       
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', ProductSchema);