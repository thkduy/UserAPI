const express = require('express');
const app = express();
const http = require('http').createServer(app);

const dotenv = require('dotenv');
dotenv.config();

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
    updateBoardValues } = require('./room');

const io = require('socket.io')(http, {
    cors: {
        origin: '*',
    }
});
app.use('*', cors());

app.use(express.json());

//connect to DB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }, () =>
    console.log('DB connect successfully')
);

//Import Routes
const authRouth = require('./routes/auth');
const adminAuthRouth = require('./routes/adminAuth');
const accountRoute = require('./routes/account');

//Route Middlewares
app.use('/api/user', authRouth);
app.use('/api/account', accountRoute);

let listOnline = {};

io.on("connection", (socket) => {

    //create game
    socket.on('create-game', ({user}) => {
        console.log('create-game');
        const {player} = createRoom({id: socket.id, user});

        io.emit('get-new-game-id',{ roomId: player.roomId });
        addBoardValues(player.roomId);
        socket.join(player.roomId);
        io.to(player.roomId).emit('roomPlayer', { roomId: player.roomId, players: getPlayers(player.roomId) });
    });
    //join game
    socket.on('join-game', ({user, roomId}, callback) => {
        console.log('join-game');
        const { error, participant } = addParticipant({ id: socket.id, user, roomId });
    
        if(error) return callback(error);
        else{
            socket.join(participant.roomId);
            callback();
            io.to(participant.roomId).emit('roomPlayer', { roomId: participant.roomId, players: getPlayers(participant.roomId) });
            io.to(participant.roomId).emit('roomViewer', { roomId: participant.roomId, viewers: getViewers(participant.roomId) });  
        }
    });

    socket.on('userSendMessage', ({roomId, message}) => {
        addMessage(message, roomId);
        //console.log(getListMessages(roomId));
        io.to(roomId).emit('serverBroadcastMessages', getListMessages(roomId));
    })

    //leave game
    socket.on('leave-game', () => {
        console.log('got disconnect');
        const user = removeUser(socket.id);

        if(user) {
            io.to(user.roomId).emit('roomPlayer', { roomId: user.roomId, players: getPlayers(user.roomId) });
            io.to(user.roomId).emit('roomViewer', { roomId: user.roomId, viewers: getViewers(user.roomId) });
        }
    })

    socket.emit("requireIdUser", {});
    socket.on("requireIdUser" , (user) => {
        socket._user = JSON.parse(user);
        //listOnline.push(user);
        if (socket._user && socket._user._id){
            listOnline[socket._user._id] = socket._user;
        }

        io.emit("sendListOnline", listOnline);
    });

    socket.on("playerSendPace", ({roomId, pace}) => {
        updateBoardValues(roomId, pace);
        io.to(roomId).emit('serverSendBoardValues', getBoardValues(roomId));
    });


    socket.on("disconnect", () => {
        if (socket._user && socket._user._id){
            delete listOnline[socket._user._id];
            io.emit("sendListOnline", listOnline);
        }
        
    });

})

const PORT = process.env.PORT || 3001;

http.listen(PORT, () => {
    console.log(`Server up and running : http://localhost:${PORT}/`);
});
