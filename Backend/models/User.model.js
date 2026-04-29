const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userModel = mongoose.Schema({
    name: { type: String, required: true },
    password: {
        type: String,
        required: true,
    },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["Admin", "Member"], default: "Member" },
});
userModel.pre("save", async function(next)  {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    catch (error) {
        next(error);
    }
})
const User = mongoose.model("User", userModel);

module.exports = User;
