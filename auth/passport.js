// const passport = require('passport');
// const localStrategy = require('passport-local').Strategy;
// const UserModel = require('../model/User');

// passport.use(
//     'login',
//     new localStrategy(
//         {
//             usernameField: 'email',
//             passwordField: 'password'
//         },
//         async (email, password, done) => {
//             try {
//                 const user = await UserModel.findOne({ email: email, accountType: 'account' });

//                 if (!user) {
//                     return done(null, false, { message: 'Email or password is wrong' });
//                 }

//                 if (!user.isActivate)
//                     return done(null, false, { message: 'Your account has not been activated. Check email to activate!' });
//                 //return res.status(400).send({message:'Your account has not been activated. Check email to activate!'})

//                 const validate = await user.isValidPassword(password);

//                 if (!validate) {
//                     return done(null, false, { message: 'Email or password is wrong' });
//                 }

//                 return done(null, user, { message: 'Logged in Successfully' });
//             } catch (error) {
//                 return done(error);
//             }
//         }
//     )
// );

// passport.use(new JWTStrategy({
//     jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
//     secretOrKey: 'caroonline'
// }, async (jwt_payload, done) => {
//     var user = await UserModel.findById(jwt_payload.id);
//     if (user) {
//         return done(null, user);
//     } else {
//         return done(err, false, {message: 'Access Denied.'});
//     }
// }));
  
  