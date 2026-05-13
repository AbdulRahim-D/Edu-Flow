const express = require("express");
const router = express.Router();
const { isAuthUser, isTeacher } = require("../middlewares/authmiddleware");
const { join } = require("path");
const { count } = require("console");
const {
  createClass,
  joinClass,
  getClassById,
  getAllClasses,
  deleteClass,
} = require("../controllers/Class.controller");

router.post("/create", isAuthUser, isTeacher, createClass);

router.patch("/join", isAuthUser, joinClass);

router.get("/", isAuthUser, getAllClasses);

router.get("/:id", isAuthUser, getClassById);

router.delete("/:classId", isAuthUser, isTeacher, deleteClass);

module.exports = router;
