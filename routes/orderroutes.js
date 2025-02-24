
const express = require("express");
const Order = require("../models/order");
const Product = require("../models/product");
const Seller = require("../models/seller");
const authMiddleware = require("../middlewares/authmiddleware");

const router = express.Router();

// routes/order.js
router.post("/orders", authMiddleware, async (req, res) => {
    try {
        const { cartItems, paymentMethod, address } = req.body;
        
        if (!cartItems || cartItems.length === 0 || !paymentMethod || !address) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let totalAmount = 0;
        const orderItems = [];

        // Fetch product details and get seller ID automatically
        for (const item of cartItems) {
            const product = await Product.findById(item._id);
            
            if (!product) {
                return res.status(404).json({ 
                    message: `Product ${item._id} not found` 
                });
            }

            orderItems.push({
                product: product._id,      // Product ID
                seller: product.seller,    // Seller ID from product
                quantity: item.quantity,
                price: product.price
            });

            totalAmount += product.price * item.quantity;
        }

        const newOrder = new Order({
            customer: req.user.userId,
            items: orderItems,
            totalAmount,
            paymentMethod,
            address,
            paymentStatus: paymentMethod === "Online Payment" ? "Paid" : "Pending",
        });

        await newOrder.save();

        res.status(201).json({ 
            message: "Order placed successfully", 
            orderId: newOrder._id 
        });

    } catch (error) {
        console.error("Order Placement Error:", error);
        res.status(500).json({ 
            message: "Error placing order", 
            error: error.message 
        });
    }
});

module.exports = router;
