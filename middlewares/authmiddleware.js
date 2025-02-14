const jwt=require('jsonwebtoken');
const authMiddleware=(req,res,next)=>{
    const authHeader=req.headers['authorization'];
    if(authHeader && authHeader.startsWith('Bearer ')){
    const token =authHeader.split(' ')[1];
    try{
const decoded = jwt.verify(token, process.env.JWT_SECRET);
//if successfully verified the value will be stored in decoded
req.user=decoded;
next();
    }catch(error){
res.status(401).json({message:"Invalid token",error});
    }
}
    else{
        return res.status(401).json({message:"No token provided ,authorization Denied"});
    }

 }

 module.exports=authMiddleware;