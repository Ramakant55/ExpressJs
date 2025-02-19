const express = require("express");
const Razorpay = require("../config/razorpay");
const Order = require("../models/order");


const router=express.Router();

router.post("/create-order", async (req, res) => {
    try{
         const {amount, currency}=req.body;
         const options={
             amount:amount*100,
             currency:currency || "INR",
             receipt:`order_rcpt_${Math.random()}`,
            
         }
         const order=await Razorpay.orders.create(options);
         res.status(200).json({message:"Order created successfully And Payment Request Generated",order});
    }catch(error){
        return res.status(500).json({message:"An error occured kripya again prayash kare"})
    }
})

module.exports=router;