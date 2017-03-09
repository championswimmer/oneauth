/**
 * Created by championswimmer on 08/03/17.
 */
const Strategy = require('passport-local').Strategy;
const models = require('../../db/models').models;

const localStrategy = new Strategy(function (username, password, cb) {


    models.UserLocal.findOne({
        include: [{model: models.User, where: {username: username}}],
    }).then(function(userLocal) {
        if (!userLocal) {
            return cb(null, false);
        }
        if (userLocal.password != password) {
            return cb(null, false);
        }
        return cb(null, userLocal.user.get());
    });

});

module.exports = localStrategy;