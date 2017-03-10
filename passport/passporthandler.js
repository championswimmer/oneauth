/**
 * Created by championswimmer on 08/03/17.
 */
const passport = require('passport');

const UserStrategies = require('./strategies/user')
    , ClientStrategies = require('./strategies/client');

const models = require('../db/models').models;

passport.use(UserStrategies.localStrategy);
passport.use(UserStrategies.fbStrategy);

passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function (userid, cb) {
    models.User.findOne({
        where: {id: userid}
    }).then((user) => cb(null, user))
});

module.exports = passport;

