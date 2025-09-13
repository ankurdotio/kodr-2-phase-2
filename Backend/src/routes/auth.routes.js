const express = require('express');
const validation = require("../middlewares/validaton.middleware")
const authController = require("../controllers/auth.controller")

const router = express.Router();


router.post("/register", validation.registerUserValidation, authController.registerUser)
router.post("/login", validation.loginUserValidation, authController.loginUser)
router.post("/logout", authController.logout)


module.exports = router;