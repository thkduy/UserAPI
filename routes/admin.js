const router = require('express').Router();
const ObjectId = require('mongodb').ObjectId;
const UserModel = require('../model/User');
const RoomModel = require('../model/Room');
const Message = require('../model/Message');

router.get('/get-all-user', async (req, res)=>{
    await UserModel.find({},{name:1, email:1, avatar:1, accountType:1, isDelete: 1},function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.status(200).send({data:result});
        }
    });
});

router.get('/get-user', async (req, res)=>{
    const idUser = req.query.id; 
    await UserModel.findById(idUser,function(err, user) {
        user.password = undefined;
        if (err) {
          console.log(err);
        } else {
          res.status(200).send({data:user});
        }
    });
});

router.post('/lock-account', async (req, res)=>{
    const idUser = req.body.id;
    await UserModel.findByIdAndUpdate({ _id: idUser }, { isDelete: true }, function (err, result) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).json({ message: "This account has been removed successfully." });
        }
    });
});

router.get('/get-all-room', async (req, res)=>{
    const roomData = await RoomModel.find().populate({path: 'player1', select: 'name avatar'}).populate({path: 'player2', select: 'name avatar'});
    for(let i = 0; i < roomData.length; i++){
        roomData[i].messages = undefined;
        roomData[i].steps = undefined;
    }
    res.status(200).json({ data: roomData });
});

router.get('/get-all-room-by-id', async (req, res)=>{
    const idUser = req.query.id; 
    const roomData = await RoomModel.find({$or:[{'player1':ObjectId(idUser)}, {'player2':ObjectId(idUser)}]})
    .populate({path: 'player1', select: 'name avatar'}).populate({path: 'player2', select: 'name avatar'});;
    for(let i = 0; i < roomData.length; i++){
        roomData[i].messages = undefined;
        roomData[i].steps = undefined;
    }
    res.status(200).json({ data: roomData });
});

router.get('/get-chat-room-by-id', async (req, res)=>{
    const idRoom = req.query.id; 
    const roomData = await RoomModel.find({roomId:idRoom}).populate({path: 'messages',populate: {path: 'owner', select: 'name avatar'}});;
    for(let i = 0; i < roomData.length; i++){
        roomData[i].steps = undefined;
    }
    res.status(200).json({ data: roomData });
});

module.exports = router;