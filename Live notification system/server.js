const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

let users = [];

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('user-login', (username) => {
    socket.username = username;
    users.push(username);
    
    io.emit('notification', {
      type: 'join',
      message: `${username} joined`,
      users: users
    });
  });

  socket.on('disconnect', () => {
    if (socket.username) {
      users = users.filter(u => u !== socket.username);
      
      io.emit('notification', {
        type: 'leave',
        message: `${socket.username} left`,
        users: users
      });
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});