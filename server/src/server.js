const server = require('express')();
const http = require('http');
const io = require('socket.io');
const cors = require('cors');

server.options('*', cors())

const httpServer = http.createServer(server)

const socketIO = io(httpServer, {
  cors: {
    origin: "http://localhost:10001",
    methods: ["GET", "POST"]
  }
});

socketIO.on('connection', function (socket) {
    console.log('A user connected: ' + socket.id);

    socket.on('disconnect', function () {
        console.log('A user disconnected: ' + socket.id);
    });
});

httpServer.listen(3000, function () {
    console.log('Server started! Port:', 3000);
});