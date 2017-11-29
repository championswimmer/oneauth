/**
 * Created by piyush0 on 17/04/17.
 */


const router = require('express').Router();
const passport = require('../../passport/passporthandler');

function authnOrAuthzGithub(req, res, next) {
  if (!req.isAuthenticated()) {
    if(config.DEBUG) console.log("Authn Github = = = = = ");
    passport.authenticate('github', {
      failureRedirect: '/login',
      successReturnToOrRedirect: '/users/me'
    })(req, res, next);
  } else {
    if(config.DEBUG) console.log("Authz Github = = = = = = ");
    passport.authorize('github', {
      failureRedirect: '/login',
      successReturnToOrRedirect: '/users/me'
    })(req, res, next);
  }
}

router.get('/', passport.authenticate('github') , function (req, res, next) {

    res.redirect('/users/me')
});

router.get('/callback', authnOrAuthzGithub);

module.exports = router;
