/**
 * Created by championswimmer on 08/03/17.
 */
const Strategy = require('passport-facebook').Strategy;
const models = require('../../db/models').models;

const secrets = require('../../secrets.json');
const config = require('../../config.json');


const fbStrategy = new Strategy({
    clientID: secrets.FB_CLIENT_ID,
    clientSecret: secrets.FB_CLIENT_SECRET,
    callbackURL: config.SERVER_URL + config.FACEBOOK_CALLBACK,
    profileFields: ['id', 'name', 'picture', 'email']
}, function (authToken, refreshToken, profile, cb) {
    let profileJson = profile._json;

    models.UserFacebook.findCreateFind({
        include: [models.User],
        where: {id: profileJson.id},
        defaults: {
            id: profileJson.id,
            accessToken: authToken,
            refreshToken: refreshToken,
            user: {
                firstname: profileJson.first_name,
                lastname: profileJson.last_name,
                email: profileJson.email,
                photo: profileJson.picture.data.url
            }
        }
    }).spread(function(userFacebook, created) {
        //TODO: Check 'created' == true to see if first time user
        if (!userFacebook) {
            return cb(null, false);
        }
        return cb(null, userFacebook.user.get())
    });

});

module.exports = fbStrategy;