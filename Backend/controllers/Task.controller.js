const Assignment = require("../models/Assignment.model");
const Class = require("../models/Class.model");
const mongoose = require("mongoose");

const createAssignment = async (req, res) => {
  try {
    const classData = await Class.findOne({ _id: req.body.classId });
    const { title, description, subject, classId, deadline } = req.body;
    if (!classData) return res.status(404).json({ message: "Class not found" });

    if (classData.teacher.toString() !== req.user.id.toString())
      return res
        .status(403)
        .json({ message: "you are not the owner of this class" });

    if (classData.students.length === 0)
      return res.status(404).json({ message: "no students joined the class" });

    const studentsAssignments = classData.students.map((studentId) => {
      return {
        title,
        description,
        subject,
        classId,
        deadline,
        assignedBy: req.user.id,
        assignedTo: studentId,
      };
    });
    const savedAssignment = await Assignment.insertMany(studentsAssignments);

    req.io.to(classId).emit("new_Assignment!", {
      message: `New Assignment:${title}`,
      subject: subject,
      deadline: deadline,
    });

    res
      .status(201)
      .json({ message: "assignment is created", data: savedAssignment });
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};

const studentAssignments = async (req, res) => {
  try {
    if (req.user.role !== "Student") {
      return res
        .status(403)
        .json({
          message: "Access denied. Only students can view their tasks.",
        });
    }
    const assignedAssignments = await Assignment.find({
      assignedTo: req.user.id,
    }).populate("assignedBy", "name email");
    return res.status(200).json({
      message: "assignment fetched successfully",
      data: assignedAssignments,
      count: assignedAssignments.length,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};

const updateAssignmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, submissionLink } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid Assignment ID Format" });

    if (status === "Submitted" && !submissionLink) {
      return res.status(400).json({ message: "Submission link is required to submit the assignment." });
    }

    const updateData = { status };
    if (submissionLink) updateData.submissionLink = submissionLink;

    const updatedAssignment = await Assignment.findOneAndUpdate(
      { _id: id, assignedTo: req.user.id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedAssignment)
      return res.status(404).json({ message: "Assignment not found or unauthorized" });

    if (status === "Submitted") {
      req.io.to(updatedAssignment.classId.toString()).emit("task_submitted", {
        studentName: req.user.name,
        assignmentTitle: updatedAssignment.title,
      });
    }

    return res.status(200).json({
      message: `Assignment moved to ${status}`,
      data: updatedAssignment,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const updateAssignmentGrade = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: "invalid class Format" });

    const assignmentData = await Assignment.findOne({ _id: req.params.id });
    if (!assignmentData) {
      return res
        .status(404)
        .json({ message: "Assignment not found! Please check the ID." });
    }
    if (assignmentData.assignedBy.toString() !== req.user.id)
      return res
        .status(400)
        .json({
          message: "access Denied! you are not the Creator of this Assignment",
        });

    const { status, grade, feedback, studentId } = req.body;
    const updatedAssignmentGrade = await Assignment.findOneAndUpdate(
      {
        _id: req.params.id,
        assignedBy: req.user.id,
        assignedTo: studentId,
      },
      { $set: { status, grade, feedback } },
      { new: true, runValidators: true },
    );
    if (!updatedAssignmentGrade)
      return res.status(404).json({ message: "Assignment not found" });
    else {
      req.io
        .to(updatedAssignmentGrade.classId.toString())
        .emit("grade_updated", {
          assignmentId: updatedAssignmentGrade._id,
          grade: grade,
        });
    }
    res.status(200).json({
      message: "grade is updated",
      data: updatedAssignmentGrade,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};

const classWiseAssignment = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.classId))
      return res.status(400).json({ message: "invalid class Format" });
    const { classId } = req.params;
    const assignments = await Assignment.find({ classId: classId })
      .populate("assignedBy", "name email")
      .sort({ createdAt: -1 });
    if (!assignments || assignments.length === 0)
      return res.status(404).json({ message: "Assignment not found" });
    res
      .status(200)
      .json({
        message: "assignments are fetched!",
        data: assignments,
        count: assignments.length,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};

const assignmentStats = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.classId))
      return res.status(400).json({ message: "invalid class Format" });
    const { classId } = req.params;
    const classData = await Class.findOne({ _id: classId });
    if (classData.teacher.toString() !== req.user.id.toString())
      return res.status(403).json({ message: "Access Denined!" });
    const assignmentStatsData = await Assignment.aggregate([
      { $match: { classId: new mongoose.Types.ObjectId(classId) } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    if (assignmentStatsData.length === 0)
      return res.status(200).json({ message: "No Assignments Found Yet!" });
    res
      .status(200)
      .json({
        message: "Data stats are Fetched",
        data: assignmentStatsData,
        count: assignmentStatsData.length,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal server Error", error: error.message });
  }
};
const teacherAssignments = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const allAssignments = await Assignment.aggregate([
      { 
        $match: { assignedBy: new mongoose.Types.ObjectId(teacherId) } 
      },
      {
        $group: {
          _id: "$title", 
          assignmentId:{$first:"$_id"}, 
          description: { $first: "$description" },
          subject: { $first: "$subject" },
          classId: { $first: "$classId" },
          deadline: { $first: "$deadline" },
          createdAt: { $first: "$createdAt" },
     
          totalStudents: { $sum: 1 } 
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    const populatedAssignments = await Assignment.populate(allAssignments, {
      path: "classId",
      select: "className students"
    });

    res.status(200).json({
      message: "All unique assignments across all classes fetched",
      data: populatedAssignments,
      totalCount: populatedAssignments.length
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Internal server error", 
      error: error.message 
    });
  }
};

const allAssignmentsByField = async (req, res) => {
  try {
    const { title, description } = req.body;


    const teacherId = req.user.id;


    const allAssignments = await Assignment.find({
      title: title,
      description: description,
      assignedBy: teacherId
    }).populate("assignedTo", "name email");

    if (!allAssignments || allAssignments.length === 0) {
      return res.status(404).json({ message: "No assignments found matching these fields." });
    }

    res.status(200).json({
      message: "All student assignments fetched successfully!",
      count: allAssignments.length,
      data: allAssignments
    });

  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = {
  createAssignment,
  studentAssignments,
  assignmentStats,
  updateAssignmentStatus,
  updateAssignmentGrade,
  teacherAssignments,
  allAssignmentsByField,
  classWiseAssignment,
};
