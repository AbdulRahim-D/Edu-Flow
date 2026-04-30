const mongoose = require("mongoose")
const classModel = mongoose.Schema({
    className: {
        type: String,
        required: true
    },
    classCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    subjectName: {
        type: String,
        required: true
    }

}, { timestamps: true })

const Class = mongoose.model("Class", classModel)
module.exports = Class