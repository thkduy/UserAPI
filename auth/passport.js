const passport = require('passport');
const UserModel = require('../model/User');
const AdminModel = require('../model/Admin');
const ObjectId = require('mongodb').ObjectId;
const passportJWT = require("passport-jwt");
const ExtractJwt = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;
let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.TOKEN_SECRET;

passport.use('user', new JWTStrategy(opts, async (jwt_payload, next) => {
    const user = await UserModel.findById(jwt_payload._id);
    if (user) {
        next(null, user);
    } else {
        next(null, false);
    }
}));

passport.use('admin', new JWTStrategy(opts, async (jwt_payload, next) => {
    const admin = await AdminModel.findById(jwt_payload._id);
    if (admin) {
        next(null, admin);
    } else {
        next(null, false);
    }
})); 