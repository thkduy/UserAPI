const makeId = require("../util/util");
const rooms = [];
let users = [];
const playNowRooms = [];


const removePlayNow = (user) => {
  let index = -1;
  for (let i = 0; i < playNowRooms.length; i++) {
    const room = playNowRooms[i];
    if (room.player1 && room.player1._id === user) {
      index = i;
      break;
    }
    if (room.player2 && room.player2._id === user) {
      index = i;
      break
    }
   }
  if (index != -1) {
    playNowRooms.splice(index, 1);
  }
}


const addPlayNow = (user) => {
  let index = -1;
  let room;
  for (let i = 0; i < playNowRooms.length; i++){
    room = playNowRooms[i];
    if (room.player2 == null) {
      room.player2 = user;
      index = i;
      break;
    }
  }
  if (index !== -1) {
    addRoom(room);
    playNowRooms.splice(index, 1);
    return room;
  }
  const newId = makeId(5);
  room = {
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
  return room;
}

const addUser = (_id, name, avatar) => {
  const exUser = users.find((value) => value._id === _id);
  if (exUser) {
    return false;
  }
  users.push({_id, name, avatar});
}

const removeUser = (_id) => {
  let index = -1;
  for (let i = 0; i < users.length; i++) {
    if (users[i]["_id"] === _id) {
      index = i;
      break;
    }
  }
  if (index != -1) {
    users.splice(index, 1);
  }
}

const addRoom = (tempRoom) => {
  rooms.push(tempRoom);
}

const getRoom = (roomId) => {
  const room = rooms.find((room) => room.id === roomId);
  return room ? room : null;
}

const addViewerToRoom = (roomId, viewer) => {
  let room;
  for (room of rooms){
    if (room.id === roomId) {
      for (let eachViewer of room.viewers){
        if (eachViewer._id === viewer._id) {
          return;
        }
      }
      room.viewers.push(viewer);
      return;
    }
  }
  throw new Error("Room not existed");
}

const setPlayer = (roomId, playerNum, user) => {
  const room = rooms.find((room) => room.id === roomId);
  if (!room) {
    return false;
  }

  const leftPlayerNum = 3 - playerNum[playerNum.length];
  if (room && room[leftPlayerNum] && room[leftPlayerNum]._id === user._id){
    return false;
  }

  if (room && !room[playerNum]){
    room[playerNum] = user;
    return true;
  }
  return false;
}

const removePlayer = (roomId, playerNum) => {
  const room = rooms.find((room) => room.id === roomId);
  if (!room) {
    return false;
  }

  if ( playerNum !== 'player1' && playerNum !== 'player2'){
    return false;
  }

  room[playerNum] = null;
  room[playerNum + 'Status'] = false;
  room.currentResultStatus = -1;
  return true;
}

const canCreateNewMatch = (roomId) => {
  const room = getRoom(roomId);
  return room && room.player1 && room.player2;
}

const getDefaultBoardState = () => {
  const defaultBoardState = new Array(16);
  for (let i = 0; i < 16; i++) {
    defaultBoardState[i] = new Array(16);
    for (let j = 0; j < 16; j++) {
      defaultBoardState[i][j] = 0;
    }
  }
  return defaultBoardState;
}

const createNewMatchToRoom = (roomId) => {
  const room = getRoom(roomId);

  if (!room || !room.player1 || !room.player2) {
    return false;
  }

  const newMatch = {
    id: makeId(5),
    player1: room.player1,
    player2: room.player2,
    result: -1,  // -1, 0, 1, 2
    firstMoveBy: 1,
    boardState: getDefaultBoardState(),
    steps: []
  }
  room.lastMatch = newMatch;

  room.playTurn = 1;
  room.currentResultStatus = -1;

  return true;
}

const setPlayerStatus = (roomId, playerNumber, status) => {
  const room = getRoom(roomId);
  if (!room || (playerNumber !== 'player1' && playerNumber !== 'player2')){
    return false;
  }
  room[playerNumber + 'Status'] = status;

  return true;
}

const areAllPlayersReady = (roomId) => {
  const room = getRoom(roomId);
  if (!room) {
    return false;
  }
  return room.player1Status && room.player2Status;
}

const getPlayTurn = (roomId) => {
  const room = getRoom(roomId);
  if (!room) {
    return 0;
  }
  return room.playTurn;
}

const addNewStep = (room, posX, posY) => {
  const lastMatch = room.lastMatch;
  if (lastMatch.boardState[posX][posY] !== 0) {
    return null;
  }

  const newBoardCellState = room.playTurn === lastMatch.firstMoveBy ? 1 : 2;
  const newStep = {
    stepNumber: lastMatch.steps.length,
    roomId: room.roomId,
    positionX: posX,
    positionY: posY,
    value: newBoardCellState
  }

  lastMatch.boardState[posX][posY] = newBoardCellState;
  lastMatch.steps.push(newStep);

  return newBoardCellState;
}


const handleNewChessMove = (roomId, row, col) => {
  const room = getRoom(roomId);
  if (!room || !room.lastMatch || !(room.player1Status || room.player2Status || room.playTurn)){
    return null;
  }

  if (row < 0 || row >= room.lastMatch.boardState.length || col < 0 || col >= room.lastMatch.boardState.length) {
    return null;
  }

  const newBoardState = addNewStep(room, row, col)
  if (!newBoardState) {
    return null;
  }

  const winLine = getWinLine(room, row, col);
  if (winLine) {
    const result = {playTurn: room.playTurn, winLine: winLine};

    room.playTurn = 0;
    room.player1Status = false;
    room.player2Status = false;

    room.lastMatch.result = result.playTurn;
    room.currentResultStatus = result.playTurn;

    return result;
  }

  //else game will be continue, toggle the playTurn
  room.playTurn = 3 - room.playTurn;
  return null;
}


const getWinLine = (room, row, col) => {
  const newBoardState = room.lastMatch.boardState[row][col];
  if (!newBoardState) {
    return null;
  }

  const boardSize = room.lastMatch.boardState.length;

  let listWinLine = [];
  for (let i = Math.max(0, col - 4) ; i <= Math.min(col + 4, boardSize - 1); i++){
    if (room.lastMatch.boardState[row][i] === newBoardState) {
      listWinLine.push({row: row, col: i});
      if (listWinLine.length === 5) {
        return listWinLine;
      }
    }
    else {
      listWinLine = [];
    }
  }

  listWinLine = [];
  for (let i = Math.max(0, row - 4) ; i <= Math.min(row + 4, boardSize - 1); i++){
    if (room.lastMatch.boardState[i][col] === newBoardState) {
      listWinLine.push({row: i, col: col});
      if (listWinLine.length === 5) {
        return listWinLine;
      }
    }
    else {
      listWinLine = [];
    }
  }

  listWinLine = [];
  let i = row - 4, j = col - 4;
  while (true) {
    if (i >= boardSize || j >= boardSize) {
      break;
    }
    if (i >= 0 && j >= 0) {
      if (room.lastMatch.boardState[i][j] === newBoardState) {
        listWinLine.push({row: i, col: j});
        if (listWinLine.length === 5){
          return listWinLine;
        }
      }
      else{
        listWinLine = [];
      }
    }
    i++;
    j++;
  }

  listWinLine = [];
  i = row - 4; j = col + 4;
  while (true) {
    if (i >= boardSize || j < 0) {
      break;
    }
    if (i >= 0 && j < boardSize) {
      if (room.lastMatch.boardState[i][j] === newBoardState) {
        listWinLine.push({row: i, col: j});
        if (listWinLine.length === 5){
          return listWinLine;
        }
      }
      else{
        listWinLine = [];
      }
    }
    i++;
    j--;
  }

  return null;
}


const changePlayTurn = (roomId, playTurn) => {
  const room = getRoom(roomId);
  if (!room) {
    return false;
  }
  room.playTurn = playTurn;
  return true;
}

const togglePlayTurn = (roomId) => {
  const room = getRoom(roomId);
  if (!room) {
    return false;
  }
  if (room.playTurn) {
    room.playTurn = 3 - room.playTurn;
  }
  return true;
}

const addMessage = (roomId, user, curMessage) => {
  const room = getRoom(roomId);
  if (!room) {
    return false;
  }
  let message = {
    owner: user,
    content: curMessage,
    date: new Date(),
  }

  room.messages.push(message);
}

const getMessages = (roomId) => {
  const room = getRoom(roomId);
  if (!room) {
    return [];
  }
  return room.messages;
}

module.exports = {
  rooms: rooms,
  users: users,
  addRoom: addRoom,
  getRoom: getRoom,
  addViewerToRoom: addViewerToRoom,
  setPlayer: setPlayer,
  removePlayer: removePlayer,
  canCreateNewMatch: canCreateNewMatch,
  createNewMatchToRoom: createNewMatchToRoom,
  setPlayerStatus: setPlayerStatus,
  areAllPlayersReady: areAllPlayersReady,
  getPlayTurn: getPlayTurn,
  addNewStep: addNewStep,
  togglePlayTurn: togglePlayTurn,
  changePlayTurn: changePlayTurn,
  handleNewChessMove: handleNewChessMove,
  addMessage: addMessage,
  getMessages: getMessages,
  addUser: addUser,
  removeUser: removeUser,
  addPlayNow: addPlayNow,
  removePlayNow: removePlayNow,
  playNows: playNowRooms
}

// let user = {
//   id: '2323',
//   name: 'haonguyen',
//   avatar: 'url'
// }

// let room = {
//   id: "23io2",
//   player1: {user},
//   player1Status: false,
//   player2: {user},
//   player2Status: false,
//   playTurn: 0,
//   currentResultStatus: -1  // -1, 0, 1, 2
//   viewers: [{user}, ],
//   messages: [{message}, ],
//   lastMatch: {match},
//   password: ""
// }

// let match = {
//   id: "34222",
//   player1: {user},
//   player2: {user},
//   result: 1,  // -1, 0, 1, 2
//   firstMoveBy: 1,
//   boardState: []
//   steps: [{step}, {step}, ]
// }

// let message = {
//   content: ""
//   owner: {user},
//   date: "22-02-2020 3442"
// }

// let step = {
//   stepNumber: 3,
//   roomId: "23232",
//   positionX: 3,
//   positionY: 5,
//   value: 0
// }

// user = {
//   accountId: "430301",
//   name: "ei292",
//   email: "2393929@ddss",
//   point: 232323,
//   totalWin: 43,
//   numOfMatches: 223
// }