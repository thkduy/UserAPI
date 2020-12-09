const express = require('express');
const app = express();
const http = require('http').createServer(app);
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

const io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});
app.use('*', cors());

app.use(express.json());


//Import Routes
const authRouth = require('./routes/auth');

//Route Middlewares
app.use('/api/user', authRouth);

dotenv.config();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://www.differentServerDomain.fr https://www.differentServerDomain.fr");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//connect to DB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }, () => 
    console.log('DB connect successfully')
);

let listOnlineUser  = {};

const PORT = process.env.PORT || '3001';
io.on('connection', (socket) => {
    console.log('a user connected');

    socket.emit("requireIdUser", {});
    socket.on("requireIdUser", (msg) => {
        console.log(msg);
        msg = JSON.parse(msg);
        if (msg && msg["_id"]){
            listOnlineUser[msg._id] = msg;
        }
        console.log(listOnlineUser);
        io.emit("listOnlineUser", listOnlineUser);
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    // socket.on('chat message', (msg) => {
    //     //io.emit('chat message', msg);
    //     socket.broadcast.emit('chat message', msg);
    // });
});

http.listen(PORT, () => {
    console.log(`Server up and running : http://localhost:${PORT}/`);
});
