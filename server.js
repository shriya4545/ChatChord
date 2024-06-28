const express = require('express');
const app = express();
const multer = require('multer');
const upload=multer({dest: 'uploads/'});
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const routes = require('./routes');
const chat = require('./src/chat');
app.set('view engine', 'ejs');

// Create HTTP server
const server = http.createServer(app);
const io = socketio(server);

// Include routes
app.use('/', routes);

// Socket.io chat
chat(io);

// Start server
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
