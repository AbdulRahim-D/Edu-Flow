const jwt=require("jsonwebtoken")

const isAuthUser=(req,res,next)=>{
    const token=req.cookies.token;
    if(!token){
        return res.status(401).json({message:"access denied,Please login!"})
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;
        next();

    }catch(error){
        res.status(401).json({message:"Invalid token"});    
    }
}
const isTeacher=(req,res,next)=>{
    if(req.user&&req.user.role==="Teacher"){
        next();
    }
    else{
        return res.status(403).json({message:"Access Denied:Only teacher can perform this action"})
    }
}


module.exports={isTeacher,isAuthUser};
