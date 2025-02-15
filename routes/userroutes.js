const express = require("express");
const User = require("../models/user");
const {sendEmail}=require("../config/emailConfig");
const jwt=require("jsonwebtoken");
const router=express.Router(); //method for routing

//create a router for post

router.post('/users/register', async (req, res) => {
    const { name, email, password, dob, phone } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Oops! This email is already registered with us." });
        }

        const newUser = new User({ name, email, password, dob, phone });
        await newUser.save();

        // Generate OTP
        const otp = generateOTP();
        // Create a JWT token with the OTP ye otp verify ke time kam aayega
        /// ye token verify otp tak shahi hai 

        // const token = jwt.sign({ otp: otp }, process.env.JWT_SECRET, { expiresIn: '10m' });

        // aur ye track karne ke liye ki email verify hui h ye nahi iss line me email include krna hoga
        const token = jwt.sign({ email: email, otp: otp }, process.env.JWT_SECRET, { expiresIn: '10m' });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to Our e-Ayurveda Platform!',
            text: `Dear ${name},\n\nThank you for registering at our e-Ayurveda platform. We are thrilled to have you on board. Please verify your email address using the following One Time Password (OTP): ${otp}. This OTP is valid for only 10 minutes.\n\nIf you did not initiate this request, please ignore this email or contact us for support.\n\nBest Regards,\nThe e-Ayurveda Team`
        };

        const emailRes = await sendEmail(mailOptions);
        res.status(200).json({ message: "User registered successfully! An OTP has been sent to your email.", emailRes, token });
    } catch (error) {
        res.status(500).json({ message: "There was an error creating your account, please try again.", error });
    }
});

router.post("/user/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

       
        // if(!result){
        //     return res.status(401).json({ message: " Does not match password" });
        // }
        // if(!user.isEmailVerified){
        //     return res.status(401).json({ message: "User is not verified Please verify your email" });
        // }

        const token = jwt.sign({ userId: user._id,email:user.email },
             process.env.JWT_SECRET,
             { expiresIn: '1h' });
        res.status(200).json({ message: "Login successful", user, token });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
});


router.get("/users",async(req,res)=>{
    try{
        const users=await User.find();
        res.status(200).json({users});
    }catch(error){
        res.status(500).json({message:"Error fetching Users",error});
    }
})

router.get("/users/:id",async(req,res)=>{
    try{
        const user=await User.findById(req.params.id);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        res.status(200).json( user);
    }catch(error){
        res.status(500).json({message:"Error fetching User",error});
    }
})
//create a router for put
router.put("/users/:id",async(req,res)=>{
    try{
        const updatedUser=await User.findByIdAndUpdate(req.params.id,req.body,{new:true});
        if(!updatedUser){
            return res.status(404).json({message:"User not found"});
        }
        res.status(200).json({message:"User updated successfully",updatedUser});
        await user.save();
        res.status(200).json({message:"User updated successfully",updatedUser});
    }catch(error){
       return res.status(500).json({message:"Error updating User",updatedUser});
    }
})
//create a router for patch
router.patch("/users/:id",async(req,res)=>{
    try{
        const updatedUser=await User.findByIdAndUpdate(req.params.id,req.body,{new:true});
        if(!updatedUser){
            return res.status(404).json({message:"User not found"});
        }
         res.status(200).json({message:"User updated successfully",updatedUser});
        
        res.status(200).json({message:"User updated successfully",updatedUser});
    }catch(error){
         return res.status(500).json({message:"Error updating User",updatedUser});
     }
})
//create a router for delete
router.delete("/users/:id",async(req,res)=>{
    try{
        const user=await User.findByIdAndDelete(req.params.id);
        if(!user){
            
            return res.status(404).json({message:"User not found"});
        }
        res.status(200).json({message:"User deleted successfully",user});
    }catch(error){
        res.status(500).json({message:"Error deleting User",error});
    }
})

module.exports=router;