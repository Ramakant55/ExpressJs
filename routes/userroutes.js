const express = require("express");

const User = require("../models/user");

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
        await newUser.save();
        res.status(200).json({message:"User created successfully",user:newUser});

    }catch(error){
     res.status(500).json({message:"Error creating User",error});
    }

   
    
})

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

module.exports=router;