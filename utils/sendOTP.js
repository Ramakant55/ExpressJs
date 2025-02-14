const crypto= require("crypto");
const nodemailer=require("nodemailer");

//otp genrate function
const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
    };

    //sendMail function 
  const sendEmail2 = async (email, otp) => {
      const transporter=nodemailer.createTransport({
          service:"gmail",
          auth:{
              user:process.env.EMAIL, //from env file
              pass:process.env.PASSWORD
          }
      })
 
  const mailOptions={
      from: process.env.EMAIL,
      to: email,
      subject: "OTP for Login",
      text: `Your OTP is ${otp}, This OTP is vaild for 10 minutes only.`
  }
  await transporter.sendMail(mailOptions);
}
module.exports={generateOTP,sendEmail2}