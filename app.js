//Basic setup of Express js
//require db.js
const connectDB = require("./config/db");
require("dotenv").config(); 
const routes=require("./routes/userroutes");
const sellerroutes=require("./routes/sellerroutes");
const productroutes=require("./routes/productroutes");
const orderroutes=require("./routes/orderroutes");
const loginroutes=require("./routes/loginroutes");
const cors=require("cors");
const express = require("express");
//reference of express
const app = express();
app.use(express.json());
app.use(cors());
//call this function for connection
connectDB();
app.get("/", (req, res) => {
    res.send("Hello World! Program Of ExpressJS");
}
)
app.use("/api",routes,);
app.use("/api",sellerroutes,);
app.use("/api",productroutes,);
app.use("/api",loginroutes,);
app.use("/api",orderroutes,);
app.listen(3000, () => {
    console.log("Server started on port 3000");
})