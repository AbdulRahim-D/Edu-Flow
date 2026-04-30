const express = require("express");
const router = express.Router();
const { isAuthUser, isTeacher } = require("../middlewares/authmiddleware");
const crypto = require("crypto");
const { join } = require("path");
const { count } = require("console");
const { createClass, joinClass, getAllClasses } = require("../controllers/Class.controller");

router.post("/create", isAuthUser, isTeacher,createClass)

router.patch("/join", isAuthUser, joinClass)

router.get("/", isAuthUser, getAllClasses)

