const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, "Assignment title is required"], 
        trim: true 
    },
    description: { type: String },
    
    subject: { 
        type: String, 
        required: true, 
        enum: ["Mathematics", "Physics", "Computer Science", "English", "Other"], // Mee college subjects pettukondi
        default: "Other" 
    },

    status: { 
        type: String, 
        required: true, 
        enum: ["To-Do", "In-Progress", "Submitted", "Graded"], 
        default: "To-Do" 
    },

    assignedTo: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    assignedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    },
    classId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: "Class"
    },

    deadline: { type: Date },
    
    submissionLink: { type: String, default: "" }

}, { timestamps: true });

const Assignment = mongoose.model("Assignment", assignmentSchema);
module.exports = Assignment;