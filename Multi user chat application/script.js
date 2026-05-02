const socket = io();

function joinRoom() {
    const username = document.getElementById('username').value;
    const room = document.getElementById('room').value;

    if (username && room) {
        socket.emit('join-room', { room, username });
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('chat-section').style.display = 'block';
        document.getElementById('room-name').textContent = room;
    }
}

function sendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value;
    const room = document.getElementById('room').value;

    if (message) {
        socket.emit('send-message', { room, message });
        input.value = '';
    }
}

socket.on('user-joined', ({ username, users }) => {
    document.getElementById('users-list').innerHTML = 
        `<strong>Users in room:</strong> ${users.join(', ')}`;
    
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML += `<div class="message system-message">${username} joined the room</div>`;
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

socket.on('receive-message', ({ username, message }) => {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML += `<div class="message"><strong>${username}:</strong> ${message}</div>`;
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

socket.on('user-left', ({ username, users }) => {
    document.getElementById('users-list').innerHTML = 
        `<strong>Users in room:</strong> ${users.join(', ')}`;
    
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML += `<div class="message system-message">${username} left the room</div>`;
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

document.getElementById('message-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});