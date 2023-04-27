require('dotenv').config();

const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/simplichatdb');

const app = require('express')();

const http = require('http').Server(app);

const userRoute = require('./routes/userRoutes');

const User = require("./models/userModel");
const Chat = require("./models/chatModel");

app.use('/', userRoute);

const io = require('socket.io')(http);

const unsp = io.of('/user-namespace');

unsp.on('connection', async socket => {
    console.log("user connected");

    const userId = socket.handshake.auth.token;

    await User.findByIdAndUpdate({ _id: userId }, { $set: { is_online: '1' }});

    // user broadcast online status
    socket.broadcast.emit('getOnlineUser', {user_id: userId});

    socket.on('disconnect', async () => {
        console.log("user disconnected");
        await User.findByIdAndUpdate({ _id: userId }, { $set: { is_online: '0' }})

        // user broadcast offline status
        socket.broadcast.emit('getOfflineUser', {user_id: userId });
    });

    // chatting implementation
    socket.on('newChat', function(data){
        socket.broadcast.emit('loadNewChat', data);
    })

    // load old chats
    socket.on('existsChat', async function(data) {
        const chats = await Chat.find({ $or: [
            { sender_id: data.sender_id, receiver_id: data.receiver_id},
            {  sender_id: data.receiver_id, receiver_id: data.sender_id }
        ]});

        socket.emit('loadChats', { chats: chats })
    })
})

const port = 8000;

http.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}/`);
})