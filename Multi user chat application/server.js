const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

const rooms = {};

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('join-room', ({ room, username }) => {
    socket.join(room);
    socket.username = username;
    socket.room = room;

    if (!rooms[room]) {
      rooms[room] = [];
    }
    rooms[room].push(username);

    io.to(room).emit('user-joined', { username, users: rooms[room] });
  });

  socket.on('send-message', ({ room, message }) => {
    io.to(room).emit('receive-message', {
      username: socket.username,
      message: message
    });
  });

  socket.on('disconnect', () => {
    if (socket.room && rooms[socket.room]) {
      rooms[socket.room] = rooms[socket.room].filter(u => u !== socket.username);
      io.to(socket.room).emit('user-left', {
        username: socket.username,
        users: rooms[socket.room]
      });
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});