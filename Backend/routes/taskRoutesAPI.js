const express = require("express");
const { isAuthUser, isTeacher } = require("../middlewares/authmiddleware");
const {
  createAssignment,
  myAssignments,
  updateAssignmentStatus,
  updateAssignmentGrade,
  classWiseAssignment,
  assignmentStats,
} = require("../controllers/Task.controller");
const router = express.Router();

router.post("/create", isAuthUser, isTeacher, createAssignment);

router.get("/my-task", isAuthUser, myAssignments);

router.patch("/update-status/:id", isAuthUser, updateAssignmentStatus);

router.patch("/grade/:id", isAuthUser, isTeacher, updateAssignmentGrade);

router.get("/class/:classId", isAuthUser, classWiseAssignment);

router.get("/stats/:classId", isAuthUser, isTeacher, assignmentStats);

module.exports = router;
