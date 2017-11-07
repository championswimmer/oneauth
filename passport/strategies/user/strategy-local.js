/**
 * Created by championswimmer on 07/05/17.
 */
const Raven = require('raven')
const LocalStrategy = require('passport-local').Strategy;
const models = require('../../../db/models').models;

const secrets = require('../../../secrets.json');
const config = require('../../../config');
const passutils = require('../../../utils/password');


/**
 * This is to authenticate _users_ using a username and password
 * via a simple post request
 */

module.exports = new LocalStrategy(function (username, password, cb) {

    models.UserLocal.findOne({
        include: [{model: models.User, where: {username: username}}],
    }).then(function(userLocal) {
        if (!userLocal) {
            return cb(null, false);
        }

        passutils.compare2hash(password, userLocal.password)
            .then(function(match) {
                if (match) {
                    return cb(null, userLocal.user.get());
                } else {
                    return cb(null, false);
                }
            })
            .catch(function (err) {
                console.trace(err.message);
                return cb(err, false, {message: err})
            });

    }).catch((err) => Raven.captureException(err))

});