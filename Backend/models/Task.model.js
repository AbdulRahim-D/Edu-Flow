const mongoose = require("mongoose");

const taskModel = mongoose.Schema({
    title: { type: String, required: true },
    description:  { type: String },
    priority: { 
        type: String, 
        enum: ["Low", "High"], 
        default: "Low" 
    },
    status: { type: String, required: true, enum: ["To-Do", "In-Progress", "Done"], default: "To-Do" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId,ref:"User" },
    projectID: { type: mongoose.Schema.Types.ObjectId, required: true ,ref:"Project"}
},{ timestamps: true })
const Task = mongoose.model("Task", taskModel)
module.exports = Task