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

// Map to store passcodes and corresponding rooms
const passcodeToRoom = new Map();

// WebSocket connection handling
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle joining a room
    socket.on('join', (passcode) => {
        console.log(`User joined with passcode: ${passcode}`);

        // Create or retrieve room based on passcode
        let room = passcodeToRoom.get(passcode);
        if (!room) {
            room = `room-${passcode}`;
            passcodeToRoom.set(passcode, room);
        }

        socket.join(room);
    });

    // Handle incoming messages
    socket.on('message', (data) => {
        // Broadcast the message to everyone in the sender's room
        const room = Object.keys(socket.rooms).find((room) => room.startsWith('room-'));
        io.to(room).emit('message', data);
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
