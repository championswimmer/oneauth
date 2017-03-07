/**
 * Created by championswimmer on 08/03/17.
 */
const passport = require('passport');

const local = require('./strategies/local')
    , facebook = require('./strategies/facebook');

passport.use(local);
passport.use(facebook);

passport.serializeUser(function (user, cb) {

});

passport.deserializeUser(function (userid, cb) {

});

module.exports = passport;

