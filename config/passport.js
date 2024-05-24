
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const User = require('../models/User');
const { JWT_SECRET } = require('../config');

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) return done(null, false, { message: 'Invalid email or password' });
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return done(null, false, { message: 'Invalid email or password' });
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET
}, async (payload, done) => {
    try {
        const user = await User.findById(payload.sub);
        if (!user) return done(null, false);
        return done(null, user);
    } catch (err) {
        return done(err, false);
    }
}));
