const express = require("express");
const { isAuthUser, isTeacher } = require("../middlewares/authmiddleware");
const {
  createAssignment,
  studentAssignments,
  updateAssignmentStatus,
  updateAssignmentGrade,
  teacherAssignments,
  classWiseAssignment,
  assignmentStats,
  allAssignmentsByField,
  deleteAssignment,
} = require("../controllers/Task.controller");
const router = express.Router();

router.post("/create", isAuthUser, isTeacher, createAssignment);

router.get("/student-task", isAuthUser, studentAssignments);

router.get("/teacher-task", isAuthUser,isTeacher, teacherAssignments);

router.patch("/update-status/:id", isAuthUser, updateAssignmentStatus);

router.patch("/grade/:id", isAuthUser, isTeacher, updateAssignmentGrade);

router.get("/class/:classId", isAuthUser, classWiseAssignment);

router.post("/allassignments", isAuthUser,isTeacher, allAssignmentsByField);

router.get("/stats/:assignmentId", isAuthUser, isTeacher, assignmentStats);

router.delete("/delete",isAuthUser,isTeacher,deleteAssignment)

module.exports = router;
