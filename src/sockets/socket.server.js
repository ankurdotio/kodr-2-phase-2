const { Server } = require("socket.io")



function initSocket(httpServer) {
    const io = new Server(httpServer)

    io.on("connection", (socket) => {
        console.log("A user connected")

        socket.on("disconnect", () => {
            console.log("A user disconnected")
        })
    })

}

module.exports = initSocket