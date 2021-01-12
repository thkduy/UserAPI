const rooms = [];

class TempRoom{
  constructor(id) {
    this.id = id;
    this.player1 = null;
    this.player2 = null;
    this.viewers = [];
    this.messages = [];
    this.matches = [];
    this.lastMatch = null;
    this.password = "";
  }
}
const addRoom = (tempRoom) => {
  rooms.push(tempRoom);
}
module.exports = {
  rooms: rooms,
  addRoom: addRoom,
}

// let room = {
//   id: "23io2",
//   player1: {user},
//   player2: {user},
//   viewers: [{user}, ],
//   messages: [{message}, ],
//   matches: [{match}]
//   lastMatch: {match},
//   password: ""
// }

// let match = {
//   id: "34222",
//   player1: {user},
//   player2: {user},
//   result: 1,  // -1, 0, 1, 2
//   firstMoveBy: 1,
//   steps: [{step}, {step}, ]
// }

// let message = {
//   id: "23232",
//   roomId: "38323030",
//   owner: {user},
//   date: "22-02-2020 3442"
// }

// let step = {
//   stepNumber: 3,
//   roomId: "23232",
//   positionX: 3,
//   positionY: 5
// }

// user = {
//   accountId: "430301",
//   username: "ei292",
//   email: "2393929@ddss",
//   point: 232323,
//   totalWin: 43,
//   numOfMatches: 223
// }