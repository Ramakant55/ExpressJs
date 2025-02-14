// const express = require("express");
// const { v4: uuidv4 } = require("uuid");
// const Order = require("../models/order");
// const { sendEmail } = require("../config/emailConfig");

// const router = express.Router();

// router.post("/orders", async (req, res) => {
//     try {
//         const { sellerId, customerName, customerEmail, customerPhone, shippingAddress, items, totalAmount, paymentMethod } = req.body;

//         if (!sellerId || !customerName || !customerEmail || !customerPhone || !shippingAddress || !items || items.length === 0 || !totalAmount || !paymentMethod) {
//             return res.status(400).json({ message: "All fields are required" });
//         }

//         const newOrder = new Order({
//             orderId: uuidv4(),
//             sellerId,
//             customerName,
//             customerEmail,
//             customerPhone,
//             shippingAddress,
//             items,
//             totalAmount,
//             paymentMethod
//         });

//         await newOrder.save();

//         const mailOptions = {
//             from: process.env.EMAIL,
//             to: customerEmail,
//             subject: "Order Confirmation - Your Order is Successful 🎉",
//             text: `Hello ${customerName},\n\nYour order has been placed successfully! 🎉\n\nOrder ID: ${newOrder.orderId}\nTotal Amount: ₹${totalAmount}\n\nThank you for shopping with us! 🚀`
//         };

//         await sendEmail(mailOptions);

//         res.status(201).json({ message: "Order placed successfully!", order: newOrder });

//     } catch (error) {
//         res.status(500).json({ message: "Error placing order", error });
//     }
// });

// router.get("/orders", async (req, res) => {
//     try {
//         const orders = await Order.find().populate("sellerId", "name email storename");
//         res.status(200).json({ orders });
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching orders", error });
//     }
// });

// router.get("/orders/:id", async (req, res) => {
//     try {
//         const order = await Order.findById(req.params.id).populate("sellerId", "name email storename");
//         if (!order) {
//             return res.status(404).json({ message: "Order not found" });
//         }
//         res.status(200).json(order);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching order", error });
//     }
// });

// router.patch("/orders/:id", async (req, res) => {
//     try {
//         const { orderStatus } = req.body;
//         const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { orderStatus }, { new: true });
//         if (!updatedOrder) {
//             return res.status(404).json({ message: "Order not found" });
//         }
//         res.status(200).json({ message: "Order updated successfully", updatedOrder });
//     } catch (error) {
//         res.status(500).json({ message: "Error updating order", error });
//     }
// });

// router.delete("/orders/:id", async (req, res) => {
//     try {
//         const deletedOrder = await Order.findByIdAndDelete(req.params.id);
//         if (!deletedOrder) {
//             return res.status(404).json({ message: "Order not found" });
//         }
//         res.status(200).json({ message: "Order deleted successfully", deletedOrder });
//     } catch (error) {
//         res.status(500).json({ message: "Error deleting order", error });
//     }
// });

// module.exports = router;





const express = require("express");
const Order = require("../models/order");
const Product = require("../models/product");
const Seller = require("../models/seller");
const authMiddleware = require("../middlewares/authmiddleware");

const router = express.Router();

router.post("/orders", authMiddleware, async (req, res) => {
    try {
        const { items, paymentMethod, address } = req.body;
        console.log("User Data in Order Route:", req.user);
        if (!items || items.length === 0 || !paymentMethod || !address) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let totalAmount = 0;

        for (const item of items) {
            const foundProduct = await Product.findById(item.product);
            if (!foundProduct) {
                return res.status(404).json({ message: `Product ${item.product} not found` });
            }
            item.price = foundProduct.price;
            item.seller = foundProduct.seller;
            totalAmount += item.price * item.quantity;
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
        res.status(201).json({ message: "Order placed successfully", orderId: newOrder._id });

    } catch (error) {
        console.error("Order Placement Error:", error);
        res.status(500).json({ message: "Error placing order", error: error.message });
    }
});

module.exports = router;
