import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:3000');

function App() {
  const [username, setUsername] = useState('');
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (joined) {
      fetch('http://localhost:3000/api/messages')
        .then(res => res.json())
        .then(data => setMessages(data));

      socket.on('receive-message', (msg) => {
        setMessages(prev => [...prev, msg]);
      });

      socket.on('user-joined', (user) => {
        setMessages(prev => [...prev, { 
          username: 'System', 
          message: `${user} joined the chat` 
        }]);
      });

      socket.on('user-left', (user) => {
        setMessages(prev => [...prev, { 
          username: 'System', 
          message: `${user} left the chat` 
        }]);
      });
    }
  }, [joined]);

  const handleJoin = () => {
    if (username) {
      socket.emit('join', username);
      setJoined(true);
    }
  };

  const handleSendMessage = () => {
    if (message) {
      socket.emit('send-message', { username, message });
      setMessage('');
    }
  };

  if (!joined) {
    return (
      <div className="login-container">
        <h1>Chat Application</h1>
        <input
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
        />
        <button onClick={handleJoin}>Join Chat</button>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <h1>Chat Room</h1>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={msg.username === 'System' ? 'system-message' : 'message'}>
            <strong>{msg.username}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;