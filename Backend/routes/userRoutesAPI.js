const express = require("express")
const router = express.Router();
const {isAuthUser}=require("../middlewares/authmiddleware")
const upload = require("../utils/fileUploadMiddleware");
const {updateProfilePic,myProfileDetails,profileUpdate, accountLogout} = require("../controllers/User.controller");

router.patch("/update-profile-pic", isAuthUser , upload.single("profilePic"), updateProfilePic)

router.get("/myprofile",isAuthUser , myProfileDetails)

router.patch("/update",isAuthUser , profileUpdate)

router.post("/logout", accountLogout)

module.exports=router