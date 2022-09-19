const server = require('express')();
const http = require('http');
const io = require('socket.io');
const cors = require('cors');

let players = [];

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

    players.push(socket.id);

    if (players.length === 1) {
        console.log('emit isPlayerA: ' + socket.id);
        socketIO.emit('isPlayerA');
    };

    socket.on('dealCards', function () {
        socketIO.emit('dealCards');
    });

    socket.on('cardPlayed', function (gameObject, isPlayerA) {
        socketIO.emit('cardPlayed', gameObject, isPlayerA);
    });

    socket.on('disconnect', function () {
        console.log('A user disconnected: ' + socket.id);
        players = players.filter(player => player !== socket.id);
    });
});

httpServer.listen(3000, function () {
    console.log('Server started! Port:', 3000);
});