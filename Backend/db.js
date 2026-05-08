const mongoose=require("mongoose")

const DBconnect=async ()=>{
    var con=await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected Successfully");
}
module.exports=DBconnect;