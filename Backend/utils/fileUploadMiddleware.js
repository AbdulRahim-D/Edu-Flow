const multer=require("multer")
const path=require("path")

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads/profilePic")
    },
    filename:(req,file,cb)=>{
         cb(null,`${req.user.id}-${Date.now()}${path.extname(file.originalname)}`)
    }
});
const fileFilter=(req,file,cb)=>{
    if(file.mimetype.startsWith("image")){
        cb(null,true)
    }
    else{
        cb(new Error("Only images are allowed for ProfilePic",false))
    }
}

const upload=multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }
})
module.exports=upload