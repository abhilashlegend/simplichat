require('dotenv').config();

const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/simplichatdb');

const app = require('express')();

const http = require('http').Server(app);

const userRoute = require('./routes/userRoutes');

const User = require("./models/userModel");

app.use('/', userRoute);

const io = require('socket.io')(http);

const unsp = io.of('/user-namespace');

unsp.on('connection', async socket => {
    console.log("user connected");

    const userId = socket.handshake.auth.token;

    await User.findByIdAndUpdate({ _id: userId }, { $set: { is_online: '1' }})

    socket.on('disconnect', async () => {
        console.log("user disconnected");
        await User.findByIdAndUpdate({ _id: userId }, { $set: { is_online: '0' }})
    })
})

const port = 8000;

http.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}/`);
})