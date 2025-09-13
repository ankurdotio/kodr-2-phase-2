require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db');
const initSocket = require('./src/sockets/socket.server');
const http = require('http');

const httpServer = http.createServer(app);

connectDB();

initSocket(httpServer);

httpServer.listen(3000, () => {
    console.log('Server is running on port 3000');
})