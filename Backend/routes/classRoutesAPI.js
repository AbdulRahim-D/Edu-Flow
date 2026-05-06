const express = require("express");
const router = express.Router();
const { isAuthUser, isTeacher } = require("../middlewares/authmiddleware");
const { join } = require("path");
const { count } = require("console");
const { createClass, joinClass, getAllClasses, getClassById } = require("../controllers/Class.controller");
const Class = require("../models/Class.model");

router.post("/create", isAuthUser, isTeacher,createClass)

router.patch("/join", isAuthUser, joinClass)

router.get("/", isAuthUser, getAllClasses)

router.get("/:id",isAuthUser,getClassById)

module.exports=router
