require('dotenv').config();

const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/simplichatdb');

const app = require('express')();

const http = require('http').Server(app);

const port = 8000;

http.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}/`);
})