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

module.exports = {
    createChat
}