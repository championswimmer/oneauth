/**
 * Created by championswimmer on 07/05/17.
 */
const Raven = require('raven')
const LocalStrategy = require('passport-local').Strategy;
const models = require('../../../db/models').models;

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
            return cb(null, false, {message: 'Invalid Username'});
        }

        passutils.compare2hash(password, userLocal.password)
            .then(function(match) {
                if (match) {
			Raven.setContext({
    				user: {
      				username: userLocal.user.get().username,
      				id: userLocal.user.get().id
    				}
  			});
		return cb(null, userLocal.user.get());
                } else {
                    return cb(null, false, {message: 'Invalid Password'});
                }
            })
            .catch(function (err) {
                console.trace(err.message);
		Raven.captureException(err);
                return cb(err, false, {message: err})
            });

    }).catch((err) => Raven.captureException(err))

});
