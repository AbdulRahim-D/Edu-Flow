const User = require("../models/User.model")

const updateProfilePic=async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "Upload the File" })    
        const imagePath = `/uploads/profilePic/${req.file.filename}`;
        const fileUpload = await User.findOneAndUpdate(
            { _id: req.user.id },
            { $set: { profileImage: imagePath } },
            { new: true }
        ).select("-password")
        if (!fileUpload) return res.status(400).json({ message: "file doesn't upload" })
        res.status(200).json({ message: "file uploaded succcessfully!", data: fileUpload })
    }
    catch (error) {
        res.status(500).json({ message: "internal server error", error: error.message })
    }
}

const myProfileDetails=async (req, res) => {
    try {
        const userData = await User.findById(req.user.id).select("-password");
        if (!userData) return res.status(404).json({ message: "User not Found!" })
        res.status(200).json({ message: "fetched User Data", data: userData })
    }
    catch (error) {
        res.status(500).json({ message: "internal server error", error: error.message })
    }
}

const profileUpdate=async (req, res) => {
    try {
        const { name, phone } = req.body
        const updateProfile = await User
            .findByIdAndUpdate(
                req.user.id,
                { $set: { name, phone } },
                {
                    new: true,
                    runValidators: true
                }
            ).select("-password");
        if (!updateProfile) return res.status(404).json({ message: "User not Found!" })
        res.status(200).json({ message: "successfully updated the profile", data: updateProfile })

    }
    catch (error) {
        res.status(500).json({ message: "internal server error", error: error.message })

    }
}

const accountLogout=async (req, res) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true
        })
        res.status(200).json({ message: "logged Out Successfully!" })
    }
    catch (error) {
        res.status(500).json({ message: "logout failed", error: error.message })
    }
}

module.exports={updateProfilePic,myProfileDetails,profileUpdate,accountLogout}