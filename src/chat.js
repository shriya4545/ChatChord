const socketio = require('socket.io');
const mongoose = require('mongoose');
const { userjoin, getcurrentuser, getroomusers, userleave } = require('./users');
const formatMessage = require('./messages');
const Msg = require('./msgSchema');

//new
const multer = require('multer');
const upload=multer({dest: 'uploads/'});
const gemini=require('./ai');
const moment=require('moment');
// const mongoDB = 'mongodb+srv://khushi14khush:Ankita16@02@cluster0.somh5.mongodb.net/message-database?retryWrites=true&w=majority&appName=Cluster0';

// mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
//     console.log('connected to MongoDB');
// }).catch(err => console.log(err));

module.exports = function (io) {
    const botName = 'Admin';

    io.on('connection', async socket => {
        socket.on('joinroom', async ({ username, room }) => {
            const user = userjoin(socket.id, username, room);
            socket.join(user.room);

            // Welcome current user
            socket.emit('message', formatMessage(botName, 'Welcome to chatCord!'));

            // Broadcast when a user connects
            socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));

            // Send users and room info
            io.to(user.room).emit('roomusers', {
                room: user.room,
                users: getroomusers(user.room)
            });

            // Fetch and send previous messages in the room
            try {
                const messages = await Msg.find({ roomName: user.room });
                console.log(messages);
                socket.emit('previousMessages', messages);
            } catch (err) {
                console.error('Error fetching previous messages:', err);
            }
        });

        // Listen for chatMessage
        socket.on('chatmessage', async (msg) => {
            const user = getcurrentuser(socket.id);
            io.to(user.room).emit('message', formatMessage(user.username, msg));
            
            // Save message to database
            try {
                await Msg.create({ roomName: user.room, username: user.username, msg });
            } catch (err) {
                console.error('Error saving message to database:', err);
            }
        });

        socket.on('aiPrompt', (msg)=>{
            console.log(msg);
            // const outputResponse = await gemini(msg);
            // console.log(outputResponse);
            // socket.emit("aiReply",outputResponse);
            gemini(msg)
            .then(outputResponse => {
                //console.log(outputResponse);
                socket.emit("aiReply", outputResponse);
            })
            .catch(error => {
                console.error("Error in gemini function:", error);
                // Handle the error, if needed
            });
        });
        // Runs when client disconnects
        socket.on('disconnect', () => {
            const user = userleave(socket.id);
            if (user) {
                io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));

                // Send users and room info
                io.to(user.room).emit('roomusers', {
                    room: user.room,
                    users: getroomusers(user.room)
                });

                const usersInRoom = getroomusers(user.room);
                if (usersInRoom.length === 0) {
                    // If no users are in the room, delete all messages associated with that room
                    try {
                         Msg.deleteMany({ roomName: user.room });
                        console.log('All messages deleted for room:', user.room);
                    } catch (err) {
                        console.error('Error deleting messages:', err);
                    }
                }

            }
        });

        socket.on('fileUpload', (file) => {
            // Broadcast file data to all connected clients
            const user = getCurrentUser(socket.id);
            //console.log(msg);
            file.username=user.username;
            file.time=moment().format('h:mm a');
            io.to(user.room).emit('fileDownload', file);
            //io.emit('fileDownload', file);
        });
    });
};
