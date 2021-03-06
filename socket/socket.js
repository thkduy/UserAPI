const tempData = require("./temporaryData");
const makeId = require("../util/util");

let listOnline = {};
module.exports = (io, socket) => {

  const addTimeoutEvent = (roomId, second) => {
    tempData.timeouts[roomId] = setTimeout(() => {
      const room = tempData.getRoom(roomId);
      if (room) {

        if (room.lastMatch) {
          room.lastMatch.result = 3 - room.playTurn;
          room.currentResultStatus = 3 - room.playTurn;
        }

        room.playTurn = 0;
        room.player1Status = false;
        room.player2Status = false;
        room.drawRequests = [];

        tempData.saveMatch(roomId);

        io.to(roomId).emit('room-info', tempData.getRoom(roomId));

        clearTimeout(tempData.timeouts.roomId);
        tempData.timeouts.roomId = null;
      }
    }, second * 1000);
  }

  const clearTimeoutEvent = (roomId) => {
    if (tempData.timeouts[roomId]) {
      clearTimeout(tempData.timeouts[roomId]);
      tempData.timeouts[roomId] = null;
    }
  }

  socket.on('required-list-online', () => {
    console.log('------required-list-online');
    socket.emit('list-online', tempData.users);
  });
  socket.on('new-user-online', user => {
    console.log('-----new-user-online ' + JSON.stringify(user));
    if (user) {
      socket.user = user;
      tempData.addUser(user._id, user.name, user.avatar);
      console.log('listUsers ' + JSON.stringify(tempData.users));
      io.emit('list-online', tempData.users);
    }
  });
  socket.on('disconnect', (reason) => {
    console.log('--------------disconnect ' + reason);
    console.log('socket user when disconnect ' + JSON.stringify(socket.user));
    if (socket.user) {
      tempData.removeUser(socket.user._id);
      tempData.removePlayNow(socket.user);
      io.emit('list-online', tempData.users);
    }
    console.log('listUser after disconnect ' + JSON.stringify(tempData.users));
  });

  socket.on('add-play-now', user => {
    console.log('add-play-now ' + JSON.stringify(user));
    const nowRoom = tempData.addPlayNow(user);
    // console.log('nowRoom ' + JSON.stringify(nowRoom));
    if (nowRoom) {
      socket.join(nowRoom.id);
      if (nowRoom.player2) {
        io.to(nowRoom.id).emit('new-game-id', nowRoom.id);
        addTimeoutEvent(nowRoom.id, 45);
        // io.to(nowRoom.id).emit('room-info', nowRoom);
      }
    }
  });

  socket.on('remove-play-now', user => {
    console.log('remove-play-now ' + JSON.stringify(user));
    if (user) {
      tempData.removePlayNow(user);
    }

  });

  //create game
  socket.on('create-game', (user, password) => {
    console.log('create-game');
    //const {player} = createRoom({id: socket.id, user});
    const newId = makeId(5);
    const tempRoom = {
      id: newId,
      player1: user,
      player1Status: false,
      player2: null,
      player2Status: false,
      currentResultStatus: -2,
      playTurn: 0,
      viewers: [user],
      messages: [],
      lastMatch: null,
      password: password ? password : "",
      drawRequests: []
    }

    tempData.addRoom(tempRoom);
    socket.join(tempRoom.id);
    socket.emit('new-game-id',tempRoom.id);
    socket.emit('room-info', tempRoom);
    //io.to(tempRoom.roomId).emit('roomPlayer', { roomId: player.roomId, players: getPlayers(player.roomId) });
  });
  //join game
  socket.on('join-game', (roomId, user, password, callback) => {
    console.log('join-game');
    try {
      if (password !== tempData.getRoom(roomId).password) {
        callback('Wrong password');
      }
      tempData.addViewerToRoom(roomId, user);
      socket.join(roomId);
      io.to(roomId).emit('room-info', tempData.getRoom(roomId));
      callback();
    } catch (e) {
      callback(e.message);
    }
  });

  //join game on path
  socket.on('join-game-on-path', (roomId, user, password, callback) => {
    console.log('join-game');
    try {
      if (password !== tempData.getRoom(roomId).password) {
        // callback('Wrong password');
        //return;
      }
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
    console.log('set-player ' + roomId + ' ' + playerNum)
    tempData.setPlayer(roomId, playerNum, user);
    io.to(roomId).emit('room-info', tempData.getRoom(roomId));
    if (tempData.canCreateNewMatch(roomId)) {
      console.log('ask-for-starting-new-match');
      io.to(roomId).emit('ask-for-starting-new-match', roomId);
    }
  });

  //starting new match
  socket.on('accept-start-new-match', (roomId, playerNumber) => {
    //check can we start here
    console.log('accept-start-new-match ' + roomId + ' ' + playerNumber)
    tempData.setPlayerStatus(roomId, playerNumber, true);

    if (tempData.areAllPlayersReady(roomId)) {
      tempData.createNewMatchToRoom(roomId);

      addTimeoutEvent(roomId, 45);

      io.to(roomId).emit('start-new-match', roomId, tempData.getPlayTurn(roomId));
      io.to(roomId).emit('room-info', tempData.getRoom(roomId));
    }
  });

  //handle chess moves
  socket.on('chess-move', (roomId, row, col) => {
    console.log('chess-move ' + roomId + ' ' + row + ' ' + col);
    clearTimeoutEvent(roomId);
    const gameResult = tempData.handleNewChessMove(roomId, row, col); //{playTurn, winLine}
    addTimeoutEvent(roomId, 45);
    io.to(roomId).emit('room-info', tempData.getRoom(roomId));
    if (gameResult) {
      clearTimeoutEvent(roomId);
      tempData.saveMatch(roomId);
      io.to(roomId).emit('end-game', gameResult)
    }

  });

  socket.on('surrender', (roomId, sessionPlayer) => {
    console.log('surrender');

    const room = tempData.getRoom(roomId);
    if (room) {
      room.playTurn = 0;
      room.player1Status = false;
      room.player2Status = false;

      if (room.lastMatch && sessionPlayer) {
        room.lastMatch.result = 3 - sessionPlayer[sessionPlayer.length - 1];
        room.currentResultStatus = 3 - sessionPlayer[sessionPlayer.length - 1];
      }

      room.drawRequests = [];
      clearTimeoutEvent(roomId);

      tempData.saveMatch(roomId);
    }

    io.to(roomId).emit('room-info', room);
  });

  socket.on('stand-up', (roomId, sessionPlayer) => {
    console.log('-----------stand-up' + roomId + ' ' + sessionPlayer);
    tempData.removePlayer(roomId, sessionPlayer);
    io.to(roomId).emit('room-info', tempData.getRoom(roomId));
    io.to(roomId).emit('end-game');
  });

  socket.on('message', (roomId, user, curMessage) => {
    tempData.addMessage(roomId, user, curMessage);
    io.to(roomId).emit('messages', tempData.getMessages(roomId).map(value => {
      return {name: value.owner.name, content: value.content}
    }));
  });

  socket.on('all-rooms-info', () => {
    socket.emit('all-rooms-info', tempData.rooms.map(value => {
      return {
        roomId: value.id,
        player1: value.player1? value.player1.name : '',
        player2: value.player2? value.player2.name : '',
        isLock: !!value.password,
      }
    }));
  });

  socket.on('draw-request', (roomId, sessionPlayer) => {
    const room = tempData.getRoom(roomId);
    if (room) {
      for (let i = 0; i< room.drawRequests.length; i++) {
        if (room.drawRequests[i] === sessionPlayer) {
          return ;
        }
      }
      room.drawRequests.push(sessionPlayer);
      if (room.drawRequests.length >= 2 ){
        room.playTurn = 0;
        room.player1Status = false;
        room.player2Status = false;

        room.lastMatch.result = 0;
        room.currentResultStatus = 0;
        room.drawRequests = [];

        clearTimeoutEvent(roomId);
      }
      io.to(roomId).emit('room-info', room);
    }
  });

  socket.on('reject-draw-request', roomId => {
    const room = tempData.getRoom(roomId);
    room.drawRequests = [];
    io.to(roomId).emit('room-info', room);
  })

  const emitAllRoomsInterval = setInterval(() => {
    socket.emit('all-rooms-info', tempData.rooms.map(value => {
      return {
        roomId: value.id,
        player1: value.player1? value.player1.name : '',
        player2: value.player2? value.player2.name : '',
        isLock: !!value.password,
      }
    }));
  }, 2000);




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