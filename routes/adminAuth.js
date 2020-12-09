const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');


router.post('/login', async (req, res) => {
    //checking if the email exists
    const user = await User.findOne({email: req.body.email, accountType: 'account', role: 'admin'});
    if(!user) return res.status(400).send({message:'Email or password is wrong'});

    //Check password
    const validPass = bcrypt.compareSync(req.body.password, user.password);
    if(!validPass) return res.status(400).send({message:'Email or password is wrong'});

    //Create and assign a token
    const token = jwt.sign({
        _id: user._id, 
        name: user.name,
        role: user.role
    }, process.env.TOKEN_SECRET);

    res.header('auth-token', token).status(200).send({message: 'success', token: token});
});



module.exports = router;