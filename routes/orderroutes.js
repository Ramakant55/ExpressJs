
const express = require("express");
const Order = require("../models/order");
const Product = require("../models/product");
const Seller = require("../models/seller");
const authMiddleware = require("../middlewares/authmiddleware");
const User = require("../models/user");
const { sendOrderConfirmation } = require("../config/emailConfig");

const router = express.Router();

router.post("/orders", authMiddleware, async (req, res) => {
    try {
        const { items, paymentMethod, address } = req.body;
        console.log("User Data in Order Route:", req.user);
        
        if (!items || items.length === 0 || !paymentMethod || !address) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let totalAmount = 0;
        let orderItems = [];

        // Get product details and calculate total
        for (const item of items) {
            const foundProduct = await Product.findById(item.product);
            if (!foundProduct) {
                return res.status(404).json({ message: `Product ${item.product} not found` });
            }
            item.price = foundProduct.price;
            item.seller = foundProduct.seller;
            totalAmount += item.price * item.quantity;

            // Store product details for email
            orderItems.push({
                name: foundProduct.name,
                quantity: item.quantity,
                price: foundProduct.price
            });
        }

        const newOrder = new Order({
            customer: req.user.userId,
            items,
            totalAmount,
            paymentMethod,
            address,
            paymentStatus: paymentMethod === "Online Payment" ? "Paid" : "Pending",
        });

        console.log("Order Saved with Customer ID:", newOrder.customer);
        await newOrder.save();

        // Fetch user email
        const user = await User.findById(req.user.userId);
        if (user && user.email) {
            try {
                // Send order confirmation email
                await sendOrderConfirmation(user.email, {
                    _id: newOrder._id,
                    items: orderItems,
                    totalAmount: totalAmount,
                    shippingAddress: address,
                    paymentMethod: paymentMethod,
                    paymentStatus: newOrder.paymentStatus
                });
                console.log('Order confirmation email sent successfully');
            } catch (emailError) {
                console.error('Failed to send order confirmation email:', emailError);
                // Don't stop the order process if email fails
            }
        }

        res.status(201).json({ 
            message: "Order placed successfully", 
            orderId: newOrder._id 
        });

    } catch (error) {
        console.error("Order Placement Error:", error);
        res.status(500).json({ message: "Error placing order", error: error.message });
    }
});

module.exports = router;
