const router = require('express').Router();
// const passport = require('passport');
// const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');

// passport.use(
//     'signup',
//     new localStrategy(
//         {
//             usernameField: 'email',
//             passwordField: 'password'
//         },
//         async (email, password, done) => {
//             try {
//                 const user = await UserModel.create({ email, password });

//                 return done(null, user);
//             } catch (error) {
//                 done(error);
//             }
//         }
//     )
// );

router.post('/register', async (req, res) => {
    //checking if the user is already in the database
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exists'); 

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
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email or password is wrong');

    //Check password
    const validPass = bcrypt.compareSync(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Email or password is wrong');

    //Create and assign a token
    const token = jwt.sign({
        _id: user._id, 
        name: user.name,
        role: user.role
    }, process.env.TOKEN_SECRET);

    res.header('auth-token', token).status(200).send({message: 'success', jwt: token});
});

module.exports = router;