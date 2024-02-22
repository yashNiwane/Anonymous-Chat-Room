const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files (like index.html) from the 'public' directory
app.use(express.static('public'));

// Define a route for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// WebSocket connection handling
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle joining a room
    socket.on('join', (passcode) => {
        console.log(`User joined with passcode: ${passcode}`);
        socket.join(passcode);
    });

    // Handle incoming messages
    socket.on('message', (message) => {
        // Broadcast the message to everyone in the room
        io.emit('message', message);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
