const nodemailer=require("nodemailer");
require('dotenv').config();

const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL, //from env file
        pass:process.env.PASSWORD
    }
});

const sendEmail=async(mailOptions)=>{
    try{
        const info=await transporter.sendMail(mailOptions);
        console.log("Email sent successfully",info.response);
        return {success:true,response:info.response};
    }catch(error){
        console.log("Email sent failed",error);
        return {success:false,error:error};
    }
};

module.exports={sendEmail};