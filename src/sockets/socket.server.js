const { Server } = require("socket.io")
const cookie = require("cookie")
const jwt = require("jsonwebtoken")
const aiService = require("../services/ai.service")

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

            // const response = await aiService.generateResult(message)
            // socket.emit("ai-response", response)

            aiService.generateStream(message, (textChunk) => {
                socket.emit("ai-response", textChunk)
            })

        })

        socket.on("disconnect", () => {
            console.log("A user disconnected")
        })
    })
}

module.exports = initSocket