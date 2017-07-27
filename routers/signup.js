/**
 * Created by championswimmer on 09/03/17.
 *
 * This is the /signup path
 */
const router = require('express').Router();
const models = require('../db/models').models;
const passutils = require('../utils/password');

router.post('/', function (req, res) {

  if(req.body.username.trim() === '') {
    req.flash('error', 'Username cannot be empty');
    return res.redirect('/signup')
  }
  if((req.body.firstname.trim() === '') || (req.body.lastname.trim() === '')) {
    req.flash('error', 'Firstname and/or Lastname cannot be empty');
    return res.redirect('/signup')
  }
  if((req.body.password.trim() === '') || req.body.password.length < 5) {
    req.flash('error', 'Password too weak. Use 5 characters at least.');
    return res.redirect('/signup')
  }

    passutils.pass2hash(req.body.password)
        .then(function (passhash) {
            models.UserLocal.create({
                user: {
                    username: req.body.username,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email
                },
                password: passhash
            }, {
                include: [models.User]
            }).then(function (user) {
                res.redirect('/login');
            })

        })
        .catch (function (err) {
            // Could not register user
            //TODO: Handle this case (use flash message maybe ? )
        });
});

module.exports = router;