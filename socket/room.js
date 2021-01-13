const players = []; //contain object {id socket, user info, room id}
const viewers = []; //contain object {id socket, user info, room id}

const listMessages = []; // {message: {name, content}, roomId}
const listBoardsValues = []; // {roomId, data: {boardValues}}

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const createRoom = ({id, user}) => {
  console.log(user);
  const roomId = makeid(5);
  const player = {id, user, roomId};
  players.push(player);
  return { player };
}

const addParticipant = ({ id, user, roomId }) => {
  console.log(user);
  const ExistPlayingRoom = players.find((player) => player.roomId === roomId);
  const ExistViewingRoom = viewers.find((view) => view.roomId === roomId);

  console.log(ExistPlayingRoom);
  console.log(ExistViewingRoom);
  if(!ExistPlayingRoom && !ExistViewingRoom)
    return {error: 'Board not found!'};
  const participant = { id, user, roomId };

  const theNumberOfPlayerInRoom = players.filter((player) => player.roomId === roomId).length; 

  if(theNumberOfPlayerInRoom < 2)
    players.push(participant);
  else
    viewers.push(participant);

  return { participant };
}

const removeUser = (id) => {
  const indexPlayer = players.findIndex((player) => player.id === id);
  const indexViewer = viewers.findIndex((viewer) => viewer.id === id);
  if(indexPlayer !== -1) return players.splice(indexPlayer, 1)[0];
  if(indexViewer !== -1) return viewers.splice(indexViewer, 1)[0];
}

// const getUser = (id) => users.find((user) => user.id === id);

const getPlayers = (roomId) => players.filter((user) => user.roomId === roomId);
const getViewers = (roomId) => viewers.filter((user) => user.roomId === roomId);

const addMessage = (message, roomId) => {
  listMessages.push({message, roomId});
}

const getListMessages = (roomId) => {
  return listMessages
                .filter((e) => e.roomId === roomId)
                .map(({message, roomId}) => message);
}

const addBoardValues = (roomId) => {
  const defaultAllValues = new Array(16);
  for (let i = 0; i < 16; i++){
    defaultAllValues[i] = new Array(16);
    for (let j = 0; j < 16; j++){
      defaultAllValues[i][j] = 0;
    }
  }
  listBoardsValues.push({roomId: roomId, data: {boardValues: defaultAllValues}});
}

const getBoardValues = (roomId) => {
  for (let i = 0; i < listBoardsValues.length; i++){
    if (listBoardsValues[i]["roomId"] === roomId){
      return listBoardsValues[i]["data"];
    }
  }
  return null;
}

const updateBoardValues = (roomId, pace) => {
  const boardValues = getBoardValues(roomId).boardValues;
  if (boardValues){
    boardValues[pace.row][pace.column] = pace.value;
  }
}

module.exports = {
  createRoom,
  addParticipant,
  getPlayers,
  getViewers,
  removeUser,
  addMessage,
  getListMessages,
  addBoardValues,
  getBoardValues,
  updateBoardValues,
};