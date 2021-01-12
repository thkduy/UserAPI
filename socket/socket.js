const {getBoardValues} = require("./room");
const {updateBoardValues} = require("./room");
const {removeUser} = require("./room");
const {getListMessages} = require("./room");
const {addMessage} = require("./room");
const {getViewers} = require("./room");
const {addParticipant} = require("./room");
const {getPlayers} = require("./room");
const {addBoardValues} = require("./room");
const {createRoom} = require("./room");

const tempData = require("./temporaryData");
const makeId = require("../util/util");
const {TempRoom} = require("./temporaryData");

let listOnline = {};
module.exports = (io, socket) => {
  //create game
  socket.on('create-game', (user) => {

    console.log('create-game');
    //const {player} = createRoom({id: socket.id, user});
    const newId = makeId(5);
    const tempRoom = {
      id: newId,
      player1: null,
      player2: null,
      viewers: [],
      messages: [],
      matches: [],
      lastMatch: {},
      password: ""
    }
    tempData.addRoom(tempRoom);

    socket.emit('new-game-id',tempRoom.id);
    socket.join(tempRoom.id);
    //io.to(tempRoom.roomId).emit('roomPlayer', { roomId: player.roomId, players: getPlayers(player.roomId) });
  });
  // //join game
  // socket.on('join-game', ({user, roomId}, callback) => {
  //   console.log('join-game');
  //   const { error, participant } = addParticipant({ id: socket.id, user, roomId });
  //
  //   if(error) return callback(error);
  //   else{
  //     socket.join(participant.roomId);
  //     callback();
  //     io.to(participant.roomId).emit('roomPlayer', { roomId: participant.roomId, players: getPlayers(participant.roomId) });
  //     io.to(participant.roomId).emit('roomViewer', { roomId: participant.roomId, viewers: getViewers(participant.roomId) });
  //   }
  // });
  //
  // socket.on('userSendMessage', ({roomId, message}) => {
  //   addMessage(message, roomId);
  //   //console.log(getListMessages(roomId));
  //   io.to(roomId).emit('serverBroadcastMessages', getListMessages(roomId));
  // })
  //
  // //leave game
  // socket.on('leave-game', () => {
  //   console.log('got disconnect');
  //   const user = removeUser(socket.id);
  //
  //   if(user) {
  //     io.to(user.roomId).emit('roomPlayer', { roomId: user.roomId, players: getPlayers(user.roomId) });
  //     io.to(user.roomId).emit('roomViewer', { roomId: user.roomId, viewers: getViewers(user.roomId) });
  //   }
  // })
  //
  // socket.emit("requireIdUser", {});
  // socket.on("requireIdUser" , (user) => {
  //   socket._user = JSON.parse(user);
  //   //listOnline.push(user);
  //   if (socket._user && socket._user._id){
  //     listOnline[socket._user._id] = socket._user;
  //   }
  //
  //   io.emit("sendListOnline", listOnline);
  // });
  //
  // socket.on("playerSendPace", ({roomId, pace}) => {
  //   updateBoardValues(roomId, pace);
  //   io.to(roomId).emit('serverSendBoardValues', getBoardValues(roomId));
  // });
  //
  // socket.on("disconnect", () => {
  //   if (socket._user && socket._user._id){
  //     delete listOnline[socket._user._id];
  //     io.emit("sendListOnline", listOnline);
  //   }
  // });
}