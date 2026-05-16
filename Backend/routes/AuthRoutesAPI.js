const express = require("express");
const router = express.Router();
const { userSignUp, userLogin } = require("../controllers/Auth.controller");


router.post("/signup",userSignUp)
router.post("/login", userLogin)

module.exports = router;