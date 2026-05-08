const User = require("../models/User.model");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");


const userSignUp= async (req, res) => {
    const isExisted = await User.findOne({ email: req.body.email });
    if (isExisted) {
        return res.status(400).json({ message: "user is already existed with this email" })
    }
    const newUser = new User({ ...req.body })
    await newUser.save();
    res.status(201).json({message:"account is created"})
}

const userLogin=async (req, res) => {
    const userData = await User.findOne({ email: req.body.email })
    if (!userData) {
        return res.status(404).json({ message: "user not Found" })
    }
    const hashed_password = userData.password;
    const isMatch = await bcrypt.compare(req.body.password, hashed_password);
    if (!isMatch) {
        return res.send("incorrect Password");
    }
    const token = jwt.sign({ id: userData._id ,name:userData.name,role:userData.role}, process.env.JWT_SECRET, { expiresIn: "10d" });
    res.cookie("token",token,{
        httpOnly:true
    }).status(200).json({ 
        message: "login successfully",
        id:userData._id,
        name:userData.name,
        email:userData.email,
         role: userData.role,
        })
}
module.exports={userSignUp,userLogin};