const express = require("express");
const User = require("../models/user");
const {sendEmail}=require("../config/emailConfig");
const jwt=require("jsonwebtoken");
const router=express.Router(); //method for routing
const crypto=require("crypto");

//create a router for post
const generateOtp=()=>{
    return crypto.randomInt(100000, 999999).toString();
}
const x=generateOtp();
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
            text: `Hello ${name},\n\nThank you for registering as a User on our platform.\n\nYour otp is ${x} \n\nBest Regards,\nYour Company Name`
        };
        
        // Send email
        const emailResponse = await sendEmail(mailOptions);
        if (!emailResponse.success) {
            console.log("Email failed:", emailResponse.error);
        }
        
        await newUser.save();
        
                const token = jwt.sign({ otp:x,email:newUser.email },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' });
        res.status(200).json({message:"User created successfully",token:token});

    }catch(error){
     res.status(500).json({message:"Error creating User",error});
    }
    
})

// router.post("/users/verify-otp",async(req,res)=>{
//     try{
//  const {otpToken,otp}=req.body;
//  const decoded=jwt.verify(otpToken,process.env.JWT_SECRET);
//  if(!decoded || decoded.otp !==otp){
// return res.status(400).json({ message: "Invalid OTP or Token Expired" });
//  }

//  const email=decoded.email;
//  const user= await User.findOne({email});
//  user.isEmailVerified=true;
//  await user.save();
//  return res.status(200).json({ message: "OTP verified successfully", user });


//     }catch(error){
//         return res.status(500).json({ message: "Error verifying OTP", error });
      
//     }
// })


router.post('/users/verify-otp',async(req,res)=>{
    const{token,userOtp}=req.body;
    try {
         const decoded = jwt.verify(token,process.env.JWT_SECRET);
         if(decoded.otp=== userOtp){
            // ye line tab add karni hai jab aap ye chahte hai ki jab tak otp verify na ho tab tak login route access na ho 
            await User.updateOne({ email: decoded.email }, { isEmailVerified: true });
            res.status(200).json({message:"OTP Verified Successfully"});
         }else{
            res.status(400).json({message:"Invalid OTP , please try again."})
         }
    } catch (error) {
        return res.status(500).json({message:"Otp verification Failed or Otp has expired"})
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