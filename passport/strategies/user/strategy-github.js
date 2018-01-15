/**
 * Created by championswimmer on 07/05/17.
 */
const Raven = require('raven')
const GithubStrategy = require('passport-github2').Strategy;

const models = require('../../../db/models').models;

const config = require('../../../config');
const secrets = config.SECRETS;
const passutils = require('../../../utils/password');

/**
 * Authenticate _users_ using their Github Accounts
 */

module.exports = new GithubStrategy({
    clientID: secrets.GITHUB_CONSUMER_KEY,
    clientSecret: secrets.GITHUB_CONSUMER_SECRET,
    callbackURL: config.SERVER_URL + config.GITHUB_CALLBACK,
    passReqToCallback: true
}, function(req, token, tokenSecret, profile, cb) {
    let profileJson = profile._json;
    let oldUser = req.user;

    if (oldUser) {
        if (config.DEBUG) console.log('User exists, is connecting Github account');
	models.UserGithub.findOne({where:{id:profileJson.id}})
	.then((ghaccount)=>{
            if(ghaccount) {
                throw new Error('Your Github account is already linked with codingblocks account Id: '+ ghaccount.dataValues.userId);
	    }
            else {
                     models.UserGithub.upsert({
                     id: profileJson.id,
                     token: token,
                     tokenSecret: tokenSecret,
                     username: profileJson.login,
                     userId: oldUser.id
                     })
                     .then(function (updated) {
                         return models.User.findById(oldUser.id)
                     })
                     .then(function (user) {
			
			Raven.setContext({
    				user: {
      				username: user.get().username,
      				id: user.get().id
				}
  			});

                         return cb(null, user.get())
                     })
                     .catch((err) => Raven.captureException(err))
                 }
        })
        .catch((err)=>{
            cb(null,false,{message: err.message});
        })
     } 
	else {
        models.User.count({ where: {username: profileJson.login}})
            .then(function(existCount){
		   
                return models.UserGithub.findCreateFind({
                    include: [models.User],
                    where: {id: profileJson.id},
                    defaults: {
                        id: profileJson.id,
                        token: token,
                        tokenSecret: tokenSecret,
                        username: profileJson.login,
                        user: {
                            username: existCount === 0 ? profileJson.login : profileJson.login + "-gh",
                            firstname: profileJson.name ? profileJson.name.split(' ')[0] : profileJson.login,
                            lastname: profileJson.name ? profileJson.name.split(' ').pop() : profileJson.login,
                            email: profileJson.email,
                            photo: profileJson.avatar_url
                        }
                    }
                })
            }).spread(function(userGithub, created) {
            //TODO: Check created == true for first time
            if (!userGithub) {
                return cb(null, false, {message: 'Authentication Failed'});
            }
		
		Raven.setContext({
    			user: {
      			username: userGithub.user.get().username,
      			id: userGithub.user.get().id
			}
  			});
		    
		return cb(null, userGithub.user.get())
        }).catch((err) => {
 	Raven.captureException(err)})
    }


});
