const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('../routes/userRouter');
const app = express();
const port = 5000;
const server = require('http').Server(app);
const io = require('socket.io')(server);
const messageModel = require('../model/message');
const messageRouter = require('../routes/messageRouter');

app.get('/', (req, res) => {
    res.send('Welcome');
});

app.use(express.json());
app.use('/users', userRouter);
app.use('/messages', messageRouter);
app.use('/upload/images', express.static('upload/images'));

// Handle Socket.IO connections
var clients = {};
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('login', (id) => {
        console.log("sender ID :" + id);
        clients[id] = socket;
    });

    socket.on('msg', async (msg) => {
        console.log(msg);
        let destination = msg.destination;
        if (clients[destination]) {
            clients[destination].emit('msg', msg);
        }

        // Insert the message into the database
        const message = new messageModel({
            senderId: msg.sender,
            receiverId: msg.destination,
            content: msg.message,
        });

        try {
            const savedMessage = await message.save();
            console.log('Message saved to the database:', savedMessage);
        } catch (error) {
            console.error('Error saving message to the database:', error);
        }
    });

    
});

// Connect to MongoDB
mongoose
    .connect('mongodb://127.0.0.1:27017/chatBD')
    .then(() => {
        // Start the server after connecting to MongoDB
        server.listen(port, () => {
            console.log(`Listening on port ${port}`);
        });
    })
    .catch((err) => {
        console.error(err);
    });
