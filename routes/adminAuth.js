const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../model/Admin');


router.post('/login', async (req, res) => {
    //checking if the email exists
    const admin = await Admin.findOne({email: req.body.email});
    if(!admin) return res.status(400).send({message:'Email or password is wrong'});

    //Check password
    const validPass = bcrypt.compareSync(req.body.password, admin.password);
    if(!validPass) return res.status(400).send({message:'Email or password is wrong'});

    //Create and assign a token
    const token = jwt.sign({
        _id: admin._id, 
        name: admin.name,
    }, process.env.TOKEN_SECRET);

    res.status(200).send({message: 'success', token: token});
});



module.exports = router;