/**
 * Created by championswimmer on 13/03/17.
 */
const cel = require('connect-ensure-login');

const router = require('express').Router();

router.get('/login', function(req, res, next) {

  if (req.user) {
    res.redirect('/users/me');
  }
  else {
    res.render('login', {title: "Login | OneAuth", error: req.flash('error')});
  }

});
router.get('/signup', function(req, res, next) {

  if(req.user) {
    res.redirect('/users/me');
  }
  else {
    res.render('signup', {title: "Signup | OneAuth"});
  }
});

router.get('/client/add',
    cel.ensureLoggedIn('/login'),
    function(req, res, next) {
        res.render('client/add', {title: "Add New Client | OneAuth"})
    }
);



module.exports = router;

