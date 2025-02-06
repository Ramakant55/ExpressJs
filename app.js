//Basic setup of Express js
//require db.js
const connectDB = require("./config/db");
require("dotenv").config(); 
const routes=require("./routes/userroutes");

const express = require("express");
//reference of express
const app = express();
app.use(express.json());

//call this function for connection
connectDB();
app.get("/", (req, res) => {
    res.send("Hello World! Program Of ExpressJS");
}
)
app.use("/api",routes);
app.listen(3000, () => {
    console.log("Server started on port 3000");
})