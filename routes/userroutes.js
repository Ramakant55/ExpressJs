const express = require("express");
const User = require("../models/user");
const {sendEmail}=require("../config/emailConfig");
const jwt=require("jsonwebtoken");
const router=express.Router(); //method for routing
const crypto=require("crypto");
const cloudinary=require("../config/cloudnary");
const multer=require("multer");

//Multer configuration storage
const storage=  multer.memoryStorage();
const upload=multer({storage});

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
            html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
                <h2 style="color: #333;">Welcome, ${name}!</h2>
                <p>Thank You For Registering On Our Ayurveda Platform.</p>
                <p>Your OTP for verification is:</p>
                <div style="background-color: #fff; border: 1px solid #ddd; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; width: 150px; margin: 20px auto;">
                    ${x}
                </div>
                <p>Best Regards,<br>Ayurveda</p>
            </div>
        `        };
        
        // Send email
        const emailResponse = await sendEmail(mailOptions);
        if (!emailResponse.success) {
            console.log("Email failed:", emailResponse.error);
        }
        
        await newUser.save();
        
                const token = jwt.sign({ otp:x,email:newUser.email},
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' });
        res.status(200).json({message:"User created successfully",token:token});

    }catch(error){
     res.status(500).json({message:"Error creating User",error});
    }
    
})


// 🟢 Save Profile with Image
router.post("/users/profile", upload.single("avatar"), async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        let avatarUrl = "";

        // 🟡 Cloudinary me image upload karo
        if (req.file) {
            const result = await cloudinary.uploader.upload_stream(
                { folder: "profiles" },
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary Upload Error:", error);
                        return res.status(500).json({ success: false, message: "Image upload failed" });
                    }
                    avatarUrl = result.secure_url;
                }
            ).end(req.file.buffer);
        }

        let user = await User.findOne({ email });

        if (user) {
            user.name = name;
            user.phone = phone;
            if (avatarUrl) user.avatar = avatarUrl;
        } else {
            user = new User({ name, email, phone, avatar: avatarUrl });
        }

        await user.save();
        res.json({ success: true, message: "Profile saved successfully!", user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


// Get Profile by Email
router.get("/users/profile/:email", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


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

router.post("/users/resend-otp", async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate new OTP using the global function
        const newOtp = generateOtp();
        const otpExpiry = Date.now() + 5 * 60 * 1000; // OTP valid for 5 min

        // Update OTP in database
        user.otp = newOtp;
        user.otpExpiry = otpExpiry;
        await user.save();

        // Email options
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Your OTP Code",
            html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
                <h2 style="color: #333;">Resend OTP</h2>
                <p>Your new OTP for verification is:</p>
                <div style="background-color: #fff; border: 1px solid #ddd; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; width: 150px; margin: 20px auto;">
                    ${newOtp}
                </div>
                <p>This OTP is valid for 5 minutes.</p>
                <p>Best Regards,<br>Ayurveda</p>
            </div>
            `
        };

        // Send OTP via email
        const emailResponse = await sendEmail(mailOptions);
        if (!emailResponse.success) {
            return res.status(500).json({ message: "Failed to send OTP", error: emailResponse.error });
        }

        res.status(200).json({ message: "OTP resent successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error resending OTP", error });
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