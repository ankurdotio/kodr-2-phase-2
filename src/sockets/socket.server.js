const { Server } = require("socket.io")
const cookie = require("cookie")
const jwt = require("jsonwebtoken")
const aiService = require("../services/ai.service")
const messageModel = require("../models/message.model")


function initSocket(httpServer) {
    const io = new Server(httpServer)


    io.use((socket, next) => {

        const cookies = socket.handshake.headers.cookie

        const { token } = cookies ? cookie.parse(cookies) : {}

        if (!token) {
            return next(new Error("Authentication error"))
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            socket.user = decoded

            next()
        } catch (err) {
            return next(new Error("Invalid token"))
        }

    })

    io.on("connection", (socket) => {
        console.log("A user connected")

        console.log(socket.user)

        socket.on("ai-message", async (message) => {

            await messageModel.create({
                chat: message.chat,
                user: socket.user.id,
                role: "user",
                text: message.text
            })

            const history = (await messageModel.find({
                chat: message.chat
            })).map(message => ({
                role: message.role,
                parts: [ {
                    text: message.text
                } ]
            }))


            const result = await aiService.generateStream(history, (text) => {
                socket.emit("ai-response", {
                    chat: message.chat,
                    text
                })
            })

            await messageModel.create({
                chat: message.chat,
                user: socket.user.id,
                role: "model",
                text: result
            })

        })


        /* 

        find = [{
        
        chat: "chatId",
        user: "userId",
        role: "user",
        text: "Hello"
        
        }]
        
        memory = [
        {
            role: "user",
            parts: [
                {
                    text: "Hello"
                }
            ]
        }
        ]
        
        */

        socket.on("disconnect", () => {
            console.log("A user disconnected")
        })
    })
}

module.exports = initSocket