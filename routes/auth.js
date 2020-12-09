const router = require('express').Router();
// const passport = require('passport');
// const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const request = require('request');

router.post('/register', async (req, res) => {
    //checking if the user is already in the database
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send({message:'Email already exists'}); 

    //Hash the password
    const N = 10;
    const hashedPassword = bcrypt.hashSync(req.body.password, N);
    
    //Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        role: 'user'
    })
    try {
        const savedUser = await user.save();
        res.send({user: user._id});
    }catch(err){
        res.status(400).send(err);
    }
});

router.post('/login', async (req, res) => {
    //checking if the email exists
    const user = await User.findOne({email: req.body.email, accountType: 'account'});
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

router.post('/login-google', async (req, res) => {
    await request('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token='+req.body.accessToken, { json: true }, async (err,resp, body) => {
        if (err) { return console.log(err); }
        const user = await User.findOne({ accountId: body.user_id });
      if (!user){
          //create new user account 
          const user = new User({
              name: req.body.name,
              email: req.body.email,
              password: '',
              role: 'user',
              accountType: 'google',
              accountId: body.user_id
          })
          try {
              const savedUser = await user.save();
              //Create and assign a token
              const token = jwt.sign({
              _id: savedUser._id,
              name: savedUser.name,
              role: savedUser.role
              }, process.env.TOKEN_SECRET);
  
              res.header('auth-token', token).status(200).send({ message: 'success', token: token });
          }catch(err){
              res.status(400).send(err);
          }
      } else{
        console.log(user);
          //Create and assign a token
          const token = jwt.sign({
          _id: user._id,
          name: user.name,
          role: user.role
          }, process.env.TOKEN_SECRET);

          res.header('auth-token', token).status(200).send({ message: 'success', token: token });
      }
    });      
});

module.exports = router;