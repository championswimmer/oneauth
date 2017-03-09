/**
 * Created by championswimmer on 08/03/17.
 */
const passport = require('passport');

const local = require('./strategies/local')
    , facebook = require('./strategies/facebook');

const models = require('../db/models').models;

passport.use(local);
passport.use(facebook);

passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function (userid, cb) {
    models.User.findOne({
        where: {id: userid}
    }).then((user) => cb(null, user))
});

module.exports = passport;

