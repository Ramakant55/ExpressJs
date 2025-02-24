const express = require("express");
const Order = require("../models/order");
const Product = require("../models/product");
const authMiddleware = require("../middlewares/authmiddleware");

const router = express.Router();

router.post("/orders", authMiddleware, async (req, res) => {
    try {
        const { cartItems, paymentMethod, address } = req.body;
        console.log("User Data in Order Route:", req.user);

        // Validate input
        if (!cartItems || cartItems.length === 0 || !paymentMethod || !address) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let totalAmount = 0;
        const enrichedItems = [];

        // Fetch product details and calculate total
        for (const item of cartItems) {
            const product = await Product.findById(item._id);
            
            if (!product) {
                return res.status(404).json({ 
                    message: `Product ${item._id} not found` 
                });
            }

            // Create order item with all required details
            enrichedItems.push({
                product: product._id,      // Product ID
                seller: product.seller,    // Seller ID from product
                quantity: item.quantity,
                price: product.price
            });

            totalAmount += product.price * item.quantity;
        }

        // Create new order
        const newOrder = new Order({
            customer: req.user.userId,
            items: enrichedItems,
            totalAmount,
            paymentMethod,
            address,
            paymentStatus: paymentMethod === "Online Payment" ? "Paid" : "Pending",
        });

        console.log("Order being saved:", newOrder);
        await newOrder.save();

        // Populate order details for response
        const populatedOrder = await Order.findById(newOrder._id)
            .populate('items.product', 'name price')
            .populate('items.seller', 'name email');

        res.status(201).json({ 
            message: "Order placed successfully", 
            orderId: newOrder._id,
            orderDetails: populatedOrder
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