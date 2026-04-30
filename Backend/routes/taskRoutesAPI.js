const express = require("express");
const {isAuthUser,isTeacher} = require("../middlewares/authmiddleware");
const Assignment=require("../models/Assignment.model");
const { createAssignment, myAssignments, updateAssignmentStatus, updateAssignmentGrade, classWiseAssignment } = require("../controllers/Task.controller");
const router = express.Router();


router.post("/create",isAuthUser,isTeacher,createAssignment)

router.get("/my-task",isAuthUser,myAssignments)

router.patch("/update-status/:id",isAuthUser,updateAssignmentStatus)

router.patch("/grade/:id",isAuthUser,isTeacher,updateAssignmentGrade)

router.get("/class/:classId",isAuthUser,classWiseAssignment)

module.exports=router