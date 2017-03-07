/**
 * Created by championswimmer on 08/03/17.
 */
const Strategy = require('passport-local').Strategy;

const localStrategy = new Strategy(function (username, password, cb) {

    // TODO: no user or wrong pass
    cb(null, false, {message: "Wrong"});

    // TODO: found user
    cb(null, user);


});

module.exports = localStrategy;