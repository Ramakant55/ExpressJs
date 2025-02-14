const express = require("express");
//npm install multer cloudinary
const multer = require("multer");
const cloudinary = require("../config/cloudnary");
const authMidleware=require("../middlewares/authmiddleware");
//db require
const Product = require("../models/product");

const router=express.Router();

//Multer configuration storage
const storage=  multer.memoryStorage();
const upload=multer({storage});

//route no 1 for uploading product

router.post("/products",authMidleware,upload.single("image"),async(req,res)=>{
    try{
        let imageurl="";
        if(req.file){
            const result= await new Promise((resolve,reject)=>{
                const stream=cloudinary.uploader.upload_stream(
                    {folder:"products"},
                    (error,result)=>{
                        if(result){
                            resolve(result);
                        }else{
                            reject(error);
                        }
                    }
                )
                stream.end(req.file.buffer);
                    
            });
            imageurl=result.secure_url;
            const {name,description,price,category,quantity,seller}=req.body;
            const newProduct=new Product({name,description,price,category,quantity,seller,imageurl});
            await newProduct.save();
            res.status(201).json({message:"Product uploaded successfully",product:newProduct});
        }


       
    }catch(error){
        res.status(500).json({message:"Error uploading product",error});
    }
})
//route no 2 for getting all products
router.get("/home_Products",async(req,res)=>{
    try{
        const products=await Product.find();
        res.status(200).json({products});
    }catch(error){
        res.status(500).json({message:"Error fetching products",error});
    }
})

//route no 3 for update a product by put method
router.patch("/products/:id",async(req,res)=>{
    try{
        const updatedProduct=await Product.findByIdAndUpdate(req.params.id,req.body,{new:true});
        if(!updatedProduct){
            return res.status(404).json({message:"Product not found"});
        }
        res.status(200).json({message:"Product updated successfully",updatedProduct});
        await product.save();
        res.status(200).json({message:"Product updated successfully",updatedProduct});
    }catch(error){
       return res.status(500).json({message:"Error updating Product",updatedProduct});
    }
})

//route no 4 for delete a product by delete method
router.delete("/products/:id",async(req,res)=>{
    try{
      const product= await Product.findByIdAndDelete(req.params.id);
      if(!product){
        return res.status(404).json({message:"Product not found"});
    }
    res.status(201).json({message:"Product deleted successfully",product});
    await product.save();
    res.status(200).json({message:"Product deleted successfully",product});

    }catch(error){
        res.status(500).json({message:"Error deleting Product",error});
    }
})

module.exports=router;