const express = require("express");
const router = express.Router();
const { userSignUp, userLogin } = require("../controllers/Auth.controller");


router.post("/auth/signup",userSignUp)
router.post("/auth/login", userLogin)

module.exports = router;