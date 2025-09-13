const express = require('express');
const authMiddleware = require("../middlewares/auth.middleware")
const validation = require("../middlewares/validaton.middleware")
const chatController = require("../controllers/chat.controller")


const router = express.Router();


/* POST /api/chats/ */
router.post("/", authMiddleware.authUser, validation.createChatValidation, chatController.createChat)

router.get("/", authMiddleware.authUser, chatController.getUserChats)


module.exports = router;