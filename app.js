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
const adminAuthRouth = require('./routes/adminAuth');

//Route Middlewares
app.use('/api/user', authRouth);

dotenv.config();

//connect to DB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }, () => 
    console.log('DB connect successfully')
);


app.use(express.json());

//Route Middlewares
app.use('/api/user', authRouth);

const PORT = process.env.PORT || '3001';

app.listen(PORT, () => {
    console.log(`Server up and running : http://localhost:${PORT}/`);
});
