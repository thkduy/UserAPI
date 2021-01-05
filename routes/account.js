const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const nodeMailer = require('../sendMail');
const bcrypt = require('bcryptjs');

router.post('/activate', async (req, res) => {
    const token = req.body.token;
    
    try {
        const data = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = await User.findById(data._id);
        if (user.isActivate) {
            res.status(400).send({ "message": "This account has been activated." });
        } else {
            await User.findByIdAndUpdate({ _id: data._id }, { isActivate: true }, function (err, result) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    res.status(200).json({ message: "Your account has been activated successfully. You can now login." });
                }
            });
        }
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/send-mail-change-password', async (req, res) => {
    const email = req.query.email;
    const user = await User.findOne({ email: email, accountType: 'account' });
    if(!user)
        res.status(400).send({"message" : "Invalid Email"});
    else {
        const token = jwt.sign({
            email: email
        }, process.env.TOKEN_SECRET);
        try{
            const data = await nodeMailer.sendMailChangePassword(user.email, token);
            res.status(200).send({"message" : "Sent email successfully."});
        } catch(error) {
            res.status(400).send(error);
        }  
    }
});

router.post('/change-password', async (req, res) => {
    const { token, password } = req.body;

    try {
        const data = jwt.verify(token, process.env.TOKEN_SECRET);
        const email = data.email;
        const user = await User.findOne({ email: email, accountType: 'account' });
        if(!user)
            res.status(400).send({"message" : "Invalid Email"});
        else {
            //Hash the password
            const N = 10;
            const hashedPassword = bcrypt.hashSync(password, N);

            await User.findOneAndUpdate({ email: email, accountType: 'account' }, { password: hashedPassword }, function (err, result) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    res.status(200).json({ message: "Your password has been changed successfully." });
                }
            });
        }
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;