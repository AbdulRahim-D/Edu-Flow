const Assignment = require("../models/Assignment.model")

const createAssignment = async (req, res) => {
    try {
        const newAssignmet = new Assignment({ ...req.body, assignedBy: req.user.id,classId:req.body.classId })
        const savedAssignment = await newAssignmet.save();
        res.status(201).json({ message: "assignment is created", data: savedAssignment })
    } catch (error) {
        res.status(500).json({  message: "internal server error", error: error.message })
    }
}

const myAssignments = async (req, res) => {
    try {
        if (req.user.role !== "Student") {
            return res.status(403).json({ message: "Access denied. Only students can view their tasks." });
        }
        const assignedAssignments = await Assignment.find({ assignedTo: req.user.id }).populate("assignedBy", "name email");
        return res.status(200)
            .json({
                message: "assignment fetched successfully",
                data: assignedAssignments,
                count: assignedAssignments.length
            });
    }
    catch (error) {
        res.status(500).json({ message: "internal server error", error: error.message })
    }
}

const updateAssignmentStatus = async (req, res) => {
    try {
        if (req.user.role !== "Student") {
            return res.status(403).json({ message: "Access denied. Only students can update their tasks-status." });
        }
        const { status, submissionLink } = req.body;
        const updatedAssignment = await Assignment
            .findOneAndUpdate(
                { _id: req.params.id, assignedTo: req.user.id },
                { $set: { status, submissionLink } },
                { new: true }
            );

        if (!updatedAssignment) return res.status(404).json({ message: "Assignment not found" })
        return res.status(200)
            .json({
                message: "assignment updated successfully",
                data: updatedAssignment,
            });
    }
    catch (error) {
        res.status(500).json({ message: "internal server error", error: error.message })
    }
}

const updateAssignmentGrade = async (req, res) => {
    try {
        const { status, grade, feedback } = req.body
        const updatedAssignmentGrade = await Assignment
            .findOneAndUpdate(
                { _id: req.params.id, assignedBy: req.user.id },
                { $set: { status, grade, feedback } },
                { new: true }
            )
        if (!updatedAssignmentGrade) return res.status(404).json({ message: "Assignment not found" })
        res.status(200).json({
            message: "grade is updated",
            data: updatedAssignmentGrade
        })
    }
    catch (error) {
        res.status(500).json({ message: "internal server error", error: error.message })
    }
}

const classWiseAssignment=async(req,res)=>{
try{
    const {classId}=req.params;
    const assignments=await Assignment.find({classId:classId}).populate("assignedBy","name email").sort({createdAt:-1})
    if(!assignments||assignments.length===0) return res.status(404).json({ message: "Assignment not found" })
    res.status(200).json({message:"assignments are fetched!",data:assignments,count:assignments.length})
}
catch(error){
        res.status(500).json({ message: "internal server error", error: error.message })
}
}

module.exports = { createAssignment, myAssignments, updateAssignmentStatus, updateAssignmentGrade,classWiseAssignment }