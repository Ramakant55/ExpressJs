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

// router.post("/products",authMidleware,upload.single("image"),async(req,res)=>{
//     try{
//         let imageurl="";
//         if(req.file){
//             const result= await new Promise((resolve,reject)=>{
//                 const stream=cloudinary.uploader.upload_stream(
//                     {folder:"products"},
//                     (error,result)=>{
//                         if(result){
//                             resolve(result);
//                         }else{
//                             reject(error);
//                         }
//                     }
//                 )
//                 stream.end(req.file.buffer);
                    
//             });
//             imageurl=result.secure_url;
            
//             const {
//                 name,
//                 description,
//                 price,
//                 originalPrice,
//                 category,
//                 subCategory,
//                 quantity,
//                 seller,
//                 sizes,
//                 tags,
//                 isBestSeller
//             } = req.body;

//             const newProduct=new Product({
//                 name,
//                 description,
//                 price,
//                 originalPrice,
//                 category,
//                 subCategory,
//                 quantity,
//                 seller,
//                 imageurl,
//                 sizes: sizes ? JSON.parse(sizes) : [],
//                 tags: tags ? JSON.parse(tags) : [],
//                 isBestSeller: isBestSeller === 'true',
//                 inStock: quantity > 0
//             });
//             await newProduct.save();
//             res.status(201).json({message:"Product uploaded successfully",product:newProduct});
//         }


       
//     }catch(error){
//         res.status(500).json({message:"Error uploading product",error});
//     }
// })
router.post("/products", authMidleware, upload.single("image"), async(req, res) => {
    try {
        let imageurl = "";
        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        // Verify seller ID
        if (!req.body.seller) {
            return res.status(400).json({ message: "Seller ID is required" });
        }

        // Upload image to cloudinary
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "products" },
                (error, result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                }
            );
            stream.end(req.file.buffer);
        });
        
        imageurl = result.secure_url;

        const {
            name,
            description,
            price,
            originalPrice,
            category,
            subCategory,
            quantity,
            seller,
            sizes,
            tags,
            isBestSeller
        } = req.body;

        // Create new product with seller ID
        const newProduct = new Product({
            name,
            description,
            price,
            originalPrice,
            category,
            subCategory,
            quantity,
            seller, // This will store the seller's ID
            imageurl,
            sizes: sizes ? JSON.parse(sizes) : [],
            tags: tags ? JSON.parse(tags) : [],
            isBestSeller: isBestSeller === 'true',
            inStock: quantity > 0
        });

        await newProduct.save();
        
        // Populate seller details if needed
        const populatedProduct = await Product.findById(newProduct._id).populate('seller', 'name email');
        
        res.status(201).json({
            message: "Product uploaded successfully",
            product: populatedProduct
        });
    } catch (error) {
        console.error('Error uploading product:', error);
        res.status(500).json({ message: "Error uploading product", error: error.message });
    }
});

//bulk upload products
router.post("/bulk-products",authMidleware,async(req,res)=>{
    try{
        const products=req.body.products;
        if(!Array.isArray(products)){
            return res.status(400).json({message:"Products must be an array"});
        }
        const insertedProducts=await Product.insertMany(products);
        res.status(201).json({message:`Successfully added ${insertedProducts.length} products`,products:insertedProducts});
    }catch(error){
        res.status(500).json({message:"Error uploading bulk products",error});
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
router.patch("/products/:id", async(req,res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );
        if(!updatedProduct) {
            return res.status(404).json({message: "Product not found"});
        }
        res.status(200).json({message: "Product updated successfully", product: updatedProduct});
    } catch(error) {
        res.status(500).json({message: "Error updating Product", error});
    }
});

//route no 4 for delete a product by delete method
router.delete("/products/:id", async(req,res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if(!product) {
            return res.status(404).json({message: "Product not found"});
        }
        res.status(200).json({message: "Product deleted successfully", product});
    } catch(error) {
        res.status(500).json({message: "Error deleting Product", error});
    }
});

//route no 5 for getting single product details
router.get("/products/:id", async(req,res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(!product) {
            return res.status(404).json({message: "Product not found"});
        }
        res.status(200).json({product});
    } catch(error) {
        res.status(500).json({message: "Error fetching product", error});
    }
});

module.exports=router;