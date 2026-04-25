const socket = io();

function login() {
    const username = document.getElementById('username').value;
    if (username) {
        socket.emit('user-login', username);
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('main-section').style.display = 'block';
    }
}

socket.on('notification', ({ type, message, users }) => {
    const notificationsDiv = document.getElementById('notifications');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notificationsDiv.appendChild(notification);
    notificationsDiv.scrollTop = notificationsDiv.scrollHeight;

    const usersList = document.getElementById('users-list');
    usersList.innerHTML = users.map(user => `<li>${user}</li>`).join('');
});

document.getElementById('username').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        login();
    }
});