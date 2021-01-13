const router = require('express').Router();
const ObjectId = require('mongodb').ObjectId;
const UserModel = require('../model/User');
const RoomModel = require('../model/Room');
const Step = require('../model/Step');
const Message = require('../model/Message');

router.get('/rank', async (req, res) => {
    const fields = {name:1, email:1, avatar:1, accountType:1, point: 1, totalWin: 1, numOfMatches:1};
    const users = await UserModel.find({}, fields, function (err, result) {
        if (err) {
            res.status(400).send(err);
        }
    }).sort({point : -1});

    res.status(200).send({data: users});
});

router.get('/get-all-game-by-userid', async (req, res)=>{
    const idUser = req.query.id; 
    const roomData = await RoomModel.find({$or:[{'player1':ObjectId(idUser)}, {'player2':ObjectId(idUser)}]})
    .populate({path: 'player1', select: 'name avatar'}).populate({path: 'player2', select: 'name avatar'});;
    for(let i = 0; i < roomData.length; i++){
        roomData[i].messages = undefined;
        roomData[i].steps = undefined;
    }
    res.status(200).json({ data: roomData });
});

router.get('/get-game-by-gameid', async (req, res)=>{
    const idRoom = req.query.id; 
    const roomData = await RoomModel.find({roomId:idRoom})
                                        .populate({path: 'player1', select: 'name avatar'})
                                        .populate({path: 'player2', select: 'name avatar'})
                                        .populate({path: 'steps'})
                                        .populate({path: 'messages',populate: {path: 'owner', select: 'name avatar'}});;
    res.status(200).json({ data: roomData });
});

module.exports = router;