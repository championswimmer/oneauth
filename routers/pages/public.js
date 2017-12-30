/**
 * Created by championswimmer on 13/03/17.
 */
const cel = require('connect-ensure-login');

const router = require('express').Router();

router.get('/login', function(req, res, next) {

  if (req.user) {
    res.redirect('/');
  }
  else {
    res.render('login', {title: "Login | OneAuth", error: req.flash('error')});
  }

});
router.get('/signup', function(req, res, next) {

  if(req.user) {
    res.redirect('/');
  }
  else {
    res.render('signup', {title: "Signup | OneAuth"});
  }
});

router.get('/forgotpassword' , function (req , res , next) {

  if(req.user) {
    res.redirect('/');
  }
  else {
    res.render('resetpassword/resetpassword',{title: "Resetpassword | OneAuth"});
  }

});

router.get('/forgotpassword/inter' , function (req , res , next) {

  if(req.user) {
    res.redirect('/');
  }
  else {
    res.render('resetpassword/inter',{title: "Resetinter | OneAuth"});
  }

});
router.get('/setnewpassword/:key' , function (req , res , next) {

  if(req.user) {
    res.redirect('/');
  }
  else {
    res.render('resetpassword/setnewpassword',{title: "Setnewpassword | OneAuth" , key:req.params.key});
  }

});

router.get('/client/add',
    cel.ensureLoggedIn('/login'),
    function(req, res, next) {
        res.render('client/add', {title: "Add New Client | OneAuth"})
    }
);



module.exports = router;
