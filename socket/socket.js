const tempData = require("./temporaryData");
const makeId = require("../util/util");

let listOnline = {};
module.exports = (io, socket) => {
  //create game
  socket.on('create-game', (user) => {

    console.log('create-game');
    //const {player} = createRoom({id: socket.id, user});
    const newId = makeId(5);
    const tempRoom = {
      id: newId,
      player1: user,
      player1Status: false,
      player2: null,
      player2Status: false,
      currentResultStatus: -1,
      playTurn: 0,
      viewers: [user],
      messages: [],
      lastMatch: null,
      password: ""
    }

    tempData.addRoom(tempRoom);
    socket.join(tempRoom.id);
    socket.emit('new-game-id',tempRoom.id);
    socket.emit('room-info', tempRoom);
    //io.to(tempRoom.roomId).emit('roomPlayer', { roomId: player.roomId, players: getPlayers(player.roomId) });
  });
  //join game
  socket.on('join-game', (roomId, user, callback) => {
    console.log('join-game');
    try {
      tempData.addViewerToRoom(roomId, user);
      socket.join(roomId);
      io.to(roomId).emit('room-info', tempData.getRoom(roomId));
      callback();
    } catch (e) {
      callback(e.message);
    }
  });

  //set-player
  socket.on('set-player', (roomId, playerNum, user) => {
    tempData.setPlayer(roomId, playerNum, user);
    io.to(roomId).emit('room-info', tempData.getRoom(roomId));
    if (tempData.canCreateNewMatch(roomId)) {
      io.to(roomId).emit('ask-for-starting-new-match', roomId);
    }
  });

  //starting new match
  socket.on('accept-start-new-match', (roomId, playerNumber) => {
    //check can we start here
    console.log('accept-start-new-match ' + roomId + ' ' + playerNumber)
    tempData.setPlayerStatus(roomId, playerNumber, true);
    console.log(JSON.stringify(tempData.getRoom(roomId)));
    if (tempData.areAllPlayersReady(roomId)) {
      tempData.createNewMatchToRoom(roomId);
      io.to(roomId).emit('start-new-match', roomId, tempData.getPlayTurn(roomId));
      io.to(roomId).emit('room-info', tempData.getRoom(roomId));
    }
  });

  //handle chess moves
  socket.on('chess-move', (roomId, row, col) => {
    console.log('chess-move ' + roomId + ' ' + row + ' ' + col);
    const gameResult = tempData.handleNewChessMove(roomId, row, col); //{playTurn, winLine}
    io.to(roomId).emit('room-info', tempData.getRoom(roomId));
    if (gameResult) {
      io.to(roomId).emit('end-game', gameResult)
    }

  });

  socket.on('stand-up', (roomId, sessionPlayer) => {
    tempData.removePlayer(roomId, sessionPlayer);
    io.to(roomId).emit('room-info', tempData.getRoom(roomId));
  })



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