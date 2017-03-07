/**
 * Created by championswimmer on 08/03/17.
 */
const Strategy = require('passport-facebook').Strategy;

const secrets = require('../../secrets.json');
const config = require('../../config.json');


const fbStrategy = new Strategy({
    clientID: secrets.FB_CLIENT_ID,
    clientSecret: secrets.FB_CLIENT_SECRET,
    callbackURL: config.SERVER_URL + '/login' + '/facebook/callback',
    profileFields: ['id', 'name', 'picture', 'email']
}, function (authToken, refreshToken, profile, cb) {

    // TODO: no user or wrong pass
    cb(null, false, {message: "Wrong"});

    // TODO: found user
    cb(null, user);

});

module.exports = fbStrategy;