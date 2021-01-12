const express = require('express');
const app = express();
const http = require('http').createServer(app);

const dotenv = require('dotenv');
dotenv.config();
const passport = require('passport');
const bodyParser = require('body-parser');
require('./auth/passport');
app.use(bodyParser.urlencoded({ extended: false }));
const mongoose = require('mongoose');
const cors = require('cors');
const {
    createRoom,
    addParticipant,
    getPlayers,
    getViewers,
    removeUser,
    addMessage,
    getListMessages,
    addBoardValues,
    getBoardValues,
    updateBoardValues } = require('./socket/room');

const io = require('socket.io')(http, {
    cors: {
        origin: '*',
    }
});
app.use('*', cors());

app.use(express.json());

//connect to DB
mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  }, () =>
    console.log('DB connect successfully')
);

//Import Routes
const authRoute = require('./routes/auth');
const adminAuthRoute = require('./routes/adminAuth');
const accountRoute = require('./routes/account');
const adminDo = require('./routes/admin');
//Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/account', accountRoute);
app.use('/api/admin', adminAuthRoute);
app.use('/api/admin/do', passport.authenticate('admin', {session: false}), adminDo);

io.on("connection", (socket) => {
    require('./socket/socket')(io, socket);
})

const PORT = process.env.PORT || 3001;

http.listen(PORT, () => {
    console.log(`Server up and running : http://localhost:${PORT}/`);
});