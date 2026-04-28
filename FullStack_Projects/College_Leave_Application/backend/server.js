const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");

dotenv.config();

const app = express();

// --- Create HTTP server and integrate Socket.IO ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your frontend URL
    methods: ["GET", "POST"]
  }
});

// Middleware to make 'io' accessible in controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});
// ------------------------------------------------

app.use(cors());
app.use(express.json());


// --- ADD THIS FULL DATABASE CONNECTION LOGIC ---
const connectDB = async () => {
  // This line will help us debug the environment variable
  console.log('Attempting to connect with MONGO_URI:', process.env.MONGO_URI);

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // This is the success message we need to see
    console.log(`SUCCESS: MongoDB Connected Successfully ✅: ${conn.connection.host}`);
  } catch (error) {
    // This will show the exact reason if the connection fails
    console.error(`ERROR: MongoDB Connection Failed ❌`);
    console.error(error);
    process.exit(1); // Exit the process with failure
  }
};

// Call the function to connect to the database
connectDB();
// ---------------------------------------------


// --- Routes ---
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.get('/api/test', (req, res) => { /* ... existing code ... */ });

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('A user connected via WebSocket');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5000;

// Use the new 'server' to listen, not 'app'
server.listen(PORT, () => {
  console.log(`SERVER STATUS: Running on http://localhost:${PORT}`);
});