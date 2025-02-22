const express = require('express');
const Seller = require('../models/seller');
const { sendEmail } = require("../config/emailConfig");
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt=require('bcrypt');
const { generateOTP, sendEmail2 } = require("../utils/sendOTP");
router.post('/seller', async (req, res) => {
    try {
        const { name, email, password, storename, address, contact } = req.body;
        const existingSeller = await Seller.findOne({ email });
        if (existingSeller) {
            return res.status(400).json({ message: "Seller already exists" });
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log("Hashed password:", hashedPassword);
        //otp genrate
        const otp=generateOTP();
        console.log("OTP:", otp);
        const otpToken=jwt.sign({
            email,otp
        },process.env.JWT_SECRET,{expiresIn:'10m'});
        console.log("OTP token:", otpToken);
        await sendEmail2(email,otp);
        
        const newSeller = new Seller({ name, email, password:hashedPassword, storename, address, contact });
        await newSeller.save();

        // Define email options
        // const mailOptions = {
        //     from: process.env.EMAIL,
        //     to: email,
        //     subject: "Welcome to Our Platform!",
        //     text: `Hello ${name},\n\nThank you for registering as a seller on our platform.\n\nStore Name: ${storename}\nContact: ${contact}\n\nBest Regards,\nYour Company Name`
        // };

        // Send email
        // const emailResponse = await sendEmail(mailOptions);
        // if (!emailResponse.success) {
        //     console.log("Email failed:", emailResponse.error);
        // }


        res.status(200).json({ 
            message: "Seller created successfully", 
            seller: newSeller,
            otpToken: otpToken
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating Seller", error:error.message });
    }
});

router.post("/seller/verify-otp",async(req,res)=>{
    try{
 const {otpToken,otp}=req.body;
 const decoded=jwt.verify(otpToken,process.env.JWT_SECRET);
 if(!decoded || decoded.otp !==otp){
return res.status(400).json({ message: "Invalid OTP or Token Expired" });
 }

 const email=decoded.email;
 const user= await Seller.findOne({email});
 user.isEmailVerified=true;
 await user.save();
 return res.status(200).json({ message: "OTP verified successfully", user });


    }catch(error){
        return res.status(500).json({ message: "Error verifying OTP", error });
      
    }
})


router.post("/seller/bulk", async (req, res) => {
    try {
        const sellers = req.body;
        if (!Array.isArray(sellers) || sellers.length === 0) {
            return res.status(400).json({ message: "Please provide an array of sellers" });
        }
        const emails = sellers.map(sellerdata => sellerdata.email);
        const existingSellers = await Seller.find({ email: { $in: emails } });
        if (existingSellers.length > 0) {
            return res.status(400).json({ message: "Some sellers already exists", existingSellers });
        }

        await Seller.insertMany(sellers);

        res.status(200).json({ message: "Sellers created successfully", sellers });
    } catch (error) {
        res.status(500).json({ message: "Error creating Sellers", error });
    }
})


router.get('/allseller', async (req, res) => {
    try {
        const sellers = await Seller.find();
        res.status(200).json({ sellers });
    } catch (error) {
        res.status(500).json({ message: "Error fetching Sellers", error });
    }
});
//seller login route
router.post("/seller/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const seller = await Seller.findOne({ email });
        if (!seller) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const result=await bcrypt.compare(password,seller.password);
        if(!result){
            return res.status(401).json({ message: " Does not match password" });
        }
        if(!seller.isEmailVerified){
            return res.status(401).json({ message: "Seller is not verified Please verify your email" });
        }

        const token = jwt.sign({ sellerId: seller._id },
             process.env.JWT_SECRET,
             { expiresIn: '1h' });
        res.status(200).json({ message: "Login successful", seller, token });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
});

router.get("/seller/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching User", error });
    }
})
// //create a router for put
router.put("/seller/:id", async (req, res) => {
    try {
        const updatedSeller = await Seller.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedSeller) {
            return res.status(404).json({ message: "Seller not found" });
        }
        res.status(200).json({ message: "Seller updated successfully", updatedSeller });
        await seller.save();
        res.status(200).json({ message: "Seller updated successfully", updatedSeller });
    } catch (error) {
        return res.status(500).json({ message: "Error updating Seller", updatedSeller });
    }
})
//create a router for patch
router.patch("/seller/:id", async (req, res) => {
    try {
        const updatedSeller = await Seller.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedSeller) {
            return res.status(404).json({ message: "Seller not found" });
        }
        res.status(200).json({ message: "Seller updated successfully", updatedSeller });
        await seller.save();
        res.status(200).json({ message: "Seller updated successfully", updatedSeller });
    } catch (error) {
        return res.status(500).json({ message: "Error updating Seller", updatedSeller });
    }
})
//create a router for delete
router.delete("/seller/:id", async (req, res) => {
    try {
        const deletedSeller = await Seller.findByIdAndDelete(req.params.id);
        if (!deletedSeller) {
            return res.status(404).json({ message: "Seller not found" });
        }
        res.status(200).json({ message: "Seller deleted successfully", deletedSeller });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting Seller", deletedSeller });
    }
})


module.exports = router;