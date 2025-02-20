const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const auth = require('../middlewares/authmiddleware');

// Get user's cart
router.get('/cart-get', auth, async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            cart = new Cart({ userId: req.user.id, items: [] });
            await cart.save();
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update cart
router.post('/cart-update', auth, async (req, res) => {
    try {
        const { items } = req.body;
        let cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            cart = new Cart({ userId: req.user.id, items: [] });
        }
        cart.items = items;
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;