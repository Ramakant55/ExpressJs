const mongoose = require("mongoose");

require("dotenv").config(); //.env se mongouri ko use krne ke liye

const connectDB=async()=>{
    try{
      await mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
     
      console.log("Monogodb Connected Sucessfully");
    }catch(error){
        console.error("Monogodb Connection Failed",error);
        process.exit(1);
    }
}

module.exports=connectDB;