const express = require('express');
const app = express();
const http = require('http').createServer(app);

const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const cors = require('cors');

const io = require('socket.io')(http, {
    cors: {
        origin: `${process.env.FRONTEND_URL}`,
        methods: ["GET", "POST"],
        credentials: true
    }
});
app.use('*', cors());

app.use(express.json());

let listOnline = {};

io.on("connection", (socket) => {
    socket.emit("requireIdUser", {});
    socket.on("requireIdUser" , (user) => {
        socket._user = JSON.parse(user);
        //listOnline.push(user);
        if (socket._user && socket._user._id){
            listOnline[socket._user._id] = socket._user;
        }

        io.emit("sendListOnline", listOnline);
    });
    socket.on("disconnect", () => {
        if (socket._user && socket._user._id){
            delete listOnline[socket._user._id];
            io.emit("sendListOnline", listOnline);
        }
    });

})

//Import Routes
const authRouth = require('./routes/auth');
const adminAuthRouth = require('./routes/adminAuth');

//Route Middlewares
app.use('/api/user', authRouth);



//connect to DB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }, () => 
    console.log('DB connect successfully')
);


app.use(express.json());

//Route Middlewares
app.use('/api/user', authRouth);

const PORT = process.env.PORT || '3001';

http.listen(PORT, () => {
    console.log(`Server up and running : http://localhost:${PORT}/`);
});
