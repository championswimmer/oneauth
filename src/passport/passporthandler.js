/**
 * Created by championswimmer on 08/03/17.
 */
const passport = require('passport')

const UserStrategies = require('./strategies/user')
    , ClientStrategies = require('./strategies/client')
    , ApiStrategies = require('./strategies/api')
    , debug = require('debug')('oauth:passporthandler')

const models = require('../db/models').models

const config = require('../../config')

passport.use(UserStrategies.localStrategy)
passport.use(UserStrategies.fbStrategy)
passport.use(UserStrategies.twitterStrategy)
passport.use(UserStrategies.githubStrategy)
passport.use(UserStrategies.googleStrategy)
passport.use(UserStrategies.lmsStrategy)

passport.use(ClientStrategies.basicStrategy)
passport.use(ClientStrategies.clientPasswordStrategy)

passport.use(ApiStrategies.bearerStrategy)

passport.serializeUser(function (user, cb) {
    if (config.DEBUG) {
        debug("Serialize =  = = = ")
        debug(user)
    }

    cb(null, user.id)
})

passport.deserializeUser(function (userid, cb) {
    if (config.DEBUG) {
        debug("Deserialize =  = = = ")
        debug(userid)
    }
    models.User.findOne({
        where: {id: userid}
    }).then(function (user) {
        if (process.env.ONEAUTH_DEV === 'localhost') {
            user.role = 'admin'
        }

        return cb(null, user)
    }).catch((err) => debug(err))
})

module.exports = passport

