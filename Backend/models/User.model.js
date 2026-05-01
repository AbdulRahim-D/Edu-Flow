const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userModel = mongoose.Schema({
    name: { type: String, required: true },
    password: {
        type: String,
        required: true,
    },
    email: { type: String, required: true, unique: true },
    profileImage: { 
        type: String
    },
    phone:{type:String,default:""},
    role: { type: String, enum: ["Teacher", "Student"], default: "Student" },
});
userModel.pre("save", async function(next) {
    if (this.isModified('password')) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        } catch (error) {
            return next(error);
        }
    }

    if (this.isNew && !this.profileImage) {
        if (this.role === "Teacher") {
            this.profileImage = "/uploads/profilePic/default-teacher.png";
        } else {
            this.profileImage = "/uploads/profilePic/default-student.png";
        }
    }

    next(); 
});
const User = mongoose.model("User", userModel);

module.exports = User;
