const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Seller",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {  // Add price field to store the price at time of order
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
        default: "Pending"
    },
    paymentMethod: {
        type: String,
        enum: ["Cash On Delivery", "Online Payment"],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid"],
        default: "Pending",
        required: true
    },
    address: {
        type: String,
        required: true
    },
    orderAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

// Add an index for better query performance
orderSchema.index({ customer: 1, orderAt: -1 });

// Add a method to calculate total amount
orderSchema.methods.calculateTotal = function() {
    return this.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
};

module.exports = mongoose.model("Order", orderSchema);