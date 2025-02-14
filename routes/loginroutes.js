const express = require("express");
const User = require("../models/user");

const router = express.Router();

router.post("/login", async (req, res) => {
    try {
        console.log("Login request received:", req.body); 

        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            console.log("Missing fields detected!"); 
            return res.status(400).json({ message: "Email aur password required hain!" });
        }

        console.log("Checking if user exists");
        const user = await User.findOne({ email });
        if (!user) {
            console.log("User does not exist!"); 
            return res.status(404).json({ message: "User exist nahi karta!" });
        }

        console.log("Matching password");
        if (password !== user.password) {
            console.log("Incorrect password!"); 
            return res.status(400).json({ message: "Galat password!" });
        }

        res.status(200).json({ message: "Login successful!", user });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed", error });
    }
});

module.exports = router;