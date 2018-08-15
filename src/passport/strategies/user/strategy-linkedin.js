const Raven = require('raven')
const LinkedinStrategy = require('passport-linkedin-oauth2').Strategy

const models = require('../../../db/models').models
const config = require('../../../../config')
const secrets = config.SECRETS

const passutils = require('../../../utils/password')
const debug = require('debug')('oauth:strategy:linkedin')

module.exports = new LinkedinStrategy({
    clientID: secrets.LINKEDIN_CLIENT_ID,
    clientSecret: secrets.LINKEDIN_CLIENT_SECRET,
    callbackURL: config.SERVER_URL + config.LINKEDIN_CALLBACK,
    passReqToCallback: true,
    scope: ['r_emailaddress', 'r_basicprofile']

}, async function (req, token, tokenSecret, profile, cb){

      let profileJson = profile._json
      let oldUser = req.user
      profileJson.email = profileJson.emails[0].value
      Raven.setContext({extra: {file: 'linkedinStrategy'}})

      try{
          if(oldUser){
              /*
              This means an already logged in users is trying to
              connect LinkedIn to his account. Let us see if there
              are any connections to his LinkedIn already
              */

              const linkedinAccount = await models.UserLinkedin.findOne({where:{id:profileJson.id}})

              if(linkedinAccount){
                  throw new Error('Your Linkedin account is already linked with codingblocks account Id: ' + lkaccount.dataValues.userId)
              } else {
                  const updated = await models.UserLinkedin.upsert({
                      id: profileJson.id,
                      token: token,
                      tokenSecret: tokenSecret,
                      username: profileJson.formattedName,
                      email: profileJson.email,
                      profile: profileJson.publicProfileUrl,
                      userId: oldUser.id
                  })
                   const user = await models.User.findById(oldUser.id)

                   if (user) {
                      return cb(null, user.get())
                  } else {
                      return cb(null, false, {message: "Could not retrieve existing Linkedin linked account"})
                  }
              }
          }

      } catch (err){
          Raven.captureException(err)
          cb(null, false, {message: err.message})
      }
  }
)
