//example save room data

const router = require('express').Router();
const Step = require('../model/Step');
const Message = require('../model/Message');
const Room = require('../model/Room');
const ObjectId = require('mongodb').ObjectId;


router.get('/addRoom', async (req,res)=>{
    const idPlayer1 = '5ff14c5115bed021187a8c14';
    const idPlayer2 = '5ff15a9be1e4ee52042868bb';
    const roomId = '12345';
    const result = 1;
    const fmb = 1;
    const stepData = [
        { stepNumber : 1, positionX : 0, positionY : 0 },
        { stepNumber : 2, positionX : 1, positionY : 0 },
        { stepNumber : 3, positionX : 0, positionY : 1 },
        { stepNumber : 4, positionX : 1, positionY : 1 },
        { stepNumber : 5, positionX : 0, positionY : 2 },
        { stepNumber : 6, positionX : 1, positionY : 2 },
        { stepNumber : 7, positionX : 0, positionY : 3 },
        { stepNumber : 8, positionX : 1, positionY : 3 },
        { stepNumber : 9, positionX : 0, positionY : 4 },
    ];
    const messageData = [
        { content : 'Hello from duy', owner : ObjectId(idPlayer1), date: Date.now() },
        { content : 'Hello from khánh duy', owner : ObjectId(idPlayer2), date: Date.now() },
        { content : 'Start game!', owner : ObjectId(idPlayer1), date: Date.now() },
    ];

    const steps = [];
    const messages = [];

    for(let i = 0 ; i < stepData.length ; i++){
        const newStep = new Step(stepData[i]);
        await newStep.save();
        steps.push(newStep._id); 
    }

    for(let i = 0 ; i < messageData.length ; i++){
        const newMessage = new Message(messageData[i]);
        await newMessage.save();
        messages.push(newMessage._id); 
    }

    const newRoom = new Room({
        roomId: roomId,
        player1: ObjectId(idPlayer1),
        player2: ObjectId(idPlayer2),
        result: result,
        firstMoveBy: fmb,
        messages: messages,
        steps: steps
    });

    await newRoom.save(async function (err, newBoard) {
        if (err)
            res.send(err);
        else {
            //example get room data
            const roomData = await Room.findById(newRoom._id).
                populate({path: 'steps'}).
                populate({path: 'messages',populate: {path: 'owner', select: 'name'}});
            res.status(200).json({ message: 'Room saved!', newRoom: roomData });
        }
    });  
});

module.exports = router;