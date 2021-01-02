const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../model/User');

router.post('/activate', async (req,res)=>{
    const token = req.body.token;

    try{
        const data = jwt.verify(token,process.env.TOKEN_SECRET);
        const user = await User.findById(data._id);
        if(user.isActivate){
            res.status(400).send({"message":"This account has been activated."});
            return;
        } else {
            await User.findByIdAndUpdate({_id: data._id}, {isActivate: true}, function(err, result) {
                if (err) {
                  res.status(400).send(err);
                } else {
                  res.status(200).json({message: "Your account has been activated successfully. You can now login."});
                }
              }
            );
        }
    } catch(error){
        res.status(400).send(error);
    }
    
});

module.exports = router;