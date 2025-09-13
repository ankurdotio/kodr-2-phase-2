const chatModel = require('../models/chat.model');



async function createChat(req, res) {
    const { title } = req.body;

    const chat = await chatModel.create({
        title,
        user: req.user.id
    })

    res.status(201).json({
        message: "Chat created successfully",
        chat
    })


}


async function getUserChats(req, res) {
    const chats = await chatModel.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({
        chats
    })
}

module.exports = {
    createChat,
    getUserChats
}