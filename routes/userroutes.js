const express = require("express");

const User = require("../models/user");
const {sendEmail}=require("../config/emailConfig");
const jwt=require("jsonwebtoken");
const router=express.Router(); //method for routing

//create a router for post

router.post("/users",async(req,res)=>{

    try{
        const {name,email,password,dob,phone}=req.body;
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }
        const newUser=new User({name,email,password,dob,phone});

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Welcome to Our Platform!",
            text: `Hello ${name},\n\nThank you for registering as a User on our platform.\n\nYour Email: ${email}\n\nBest Regards,\nYour Company Name`
        };

        // Send email
        const emailResponse = await sendEmail(mailOptions);
        if (!emailResponse.success) {
            console.log("Email failed:", emailResponse.error);
        }

        await newUser.save();
        res.status(200).json({message:"User created successfully",user:newUser});

    }catch(error){
     res.status(500).json({message:"Error creating User",error});
    }

   
    
})

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