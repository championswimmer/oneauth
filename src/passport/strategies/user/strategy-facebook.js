/**
 * Created by championswimmer on 07/05/17.
 */
const Raven = require('raven')
const FacebookStrategy = require('passport-facebook').Strategy

const models = require('../../../db/models').models

const config = require('../../../../config')
const secrets = config.SECRETS
const passutils = require('../../../utils/password')
const tracer = require('../../../utils/ddtracer').tracer
const debug = require('debug')('oauth:strategy:facebook')


/**
 * This is to authenticate _users_ using their
 * Facebook accounts
 */

module.exports = new FacebookStrategy({
    clientID: secrets.FB_CLIENT_ID,
    clientSecret: secrets.FB_CLIENT_SECRET,
    callbackURL: config.SERVER_URL + config.FACEBOOK_CALLBACK,
    profileFields: ['id', 'name', 'picture', 'email'],
    passReqToCallback: true,
}, async function (req, authToken, refreshToken, profile, cb) {
    let profileJson = profile._json
    let oldUser = req.user
    // DATADOG TRACE: START SPAN
    Raven.setContext({extra: {file: 'fbstrategy'}})
    const span = tracer.startSpan('passport.strategy.facebook')

    try{
        if(oldUser) {
            const fbaccount = await  models.UserFacebook.findOne({where: {id: profileJson.id}})

            if (fbaccount) {
                throw new Error('Your Facebook account is already linked with codingblocks account Id: ' + fbaccount.dataValues.userId)
            }else{
                const updated = await models.UserFacebook.upsert({
                    id: profileJson.id,
                    accessToken: authToken,
                    refreshToken: refreshToken,
                    photo: "https://graph.facebook.com/" + profileJson.id + "/picture?type=large",
                    userId: oldUser.id
                })

                const user = await models.User.findById(oldUser.id)

                if(user){
                    user.update({photo: "https://graph.facebook.com/" + profileJson.id + "/picture?type=large"})
                    setImmediate(() => {
                        span.addTags({
                            resource: req.path,
                            type: 'web',
                            'span.kind': 'server',
                            userId: oldUser.id,
                            newUser: false,
                            facebookId: profileJson.id
                        })
                        span.finish()
                    })
                    return cb(null, user.get())
                }else{
                    return cb(err, null,{message: "Could not retrieve existing Twitter linked account"})
                }
            }
        } else {
            /*
            First ensure there aren't already users with the same email
            id that comes from facebook
             */
            const existingUsers = await models.User.findAll({
                include: [{
                    model: models.UserFacebook,
                    attributes: ['id'],
                    required: false
                }],
                where: {
                    email: profileJson.email,
                    '$userfacebook.id$': {$eq: null}
                }
            })
            if (existingUsers && existingUsers.length > 0) {
                let oldIds = existingUsers.map(eu => eu.id).join(',')
                return cb(null, false, {
                    message: `
                    Your email id "${profileJson.email}" is already used in the following Coding Blocks Account(s): 
                    [ ${oldIds} ]
                    Please log into your old account and connect Facebook in it instead.
                    Use 'Forgot Password' option if you do not remember password of old account`
                })
            }

            const [userFacebook, created] = await  models.UserFacebook.findCreateFind({
                include: [models.User],
                where: {id: profileJson.id},
                defaults: {
                    id: profileJson.id,
                    accessToken: authToken,
                    refreshToken: refreshToken,
                    photo: "https://graph.facebook.com/" + profileJson.id + "/picture?type=large",
                    user: {
                        username: profileJson.first_name + '-' + profileJson.last_name + '-' + profileJson.id,
                        firstname: profileJson.first_name,
                        lastname: profileJson.last_name,
                        email: profileJson.email,
                        photo: "https://graph.facebook.com/" + profileJson.id + "/picture?type=large"
                    }
                }
            })

            if (!userFacebook) {
                return cb(null, false, {message: 'Authentication Failed'})
            }

            setImmediate(() => {
                span.addTags({
                    resource: req.path,
                    type: 'web',
                    'span.kind': 'server',
                    userId: userFacebook && userFacebook.user && userFacebook.user.id,
                    newUser: true,
                    facebookId: profileJson.id
                })
                span.finish()
            })
            return cb(null, userFacebook.user.get())

        }
    }catch (err) {
        Raven.captureException(err)
        return cb(null,false,{message:err.message})
    }

})
