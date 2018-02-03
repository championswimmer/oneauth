/**
 * Created by himank on 15/12/17.
 *
 * This sets new password.
 */
const router = require('express').Router();
const models = require('../db/models').models;
const passutils = require('../utils/password');
const makeGaEvent = require('../utils/ga').makeGaEvent;
const mail = require('../utils/email');
const moment =require('moment');
const Raven = require('raven');

router.post('/', makeGaEvent('submit', 'form', 'setnewpassword'), function (req, res) {
  req.body.key = req.body.key.trim();
  req.body.password = req.body.password.trim();
  req.body.passwordagain = req.body.passwordagain.trim();
   if((req.body.key === '') || req.body.key.length != 15) {

    req.flash('error', 'Invalid key. please try again.');
    return res.redirect('/forgotpassword');
  }

  if((req.body.password === '') || req.body.password.length < 5) {

    req.flash('error', 'Password too weak. Please use at least 5 characters.');
    return res.render('resetpassword/setnewpassword', {title: "Setnewpassword | OneAuth" , key:req.body.key});
  }

  if(req.body.password !== req.body.passwordagain) {

    req.flash('error', 'Password does not match.');
    return res.render('resetpassword/setnewpassword', {title: "Setnewpassword | OneAuth" , key:req.body.key});
  }

  models.Resetpassword.findOne({ where: { key: req.body.key }})

  .then((resetEntry) => {

      if(!resetEntry) {
        req.flash('error', 'Invalid key. please try again.');
        return res.redirect('/forgotpassword')
      }

      if ( moment().diff(resetEntry.createdAt , 'seconds') <= 86400 ) {

        return models.UserLocal.findOne({
          where:{userId:resetEntry.dataValues.userId}
        })
        .then(function(userlocal){

          let passhash = passutils.pass2hash(req.body.password);

          return Promise.all([userlocal,passhash])

        })
        .then( ([userlocal,passhash]) =>{

            if(userlocal){

              return models.UserLocal.update(
                {password:passhash},
                {where:{userId:userlocal.dataValues.userId}}
              )

            } else {

              return models.UserLocal.create({
                password:passhash,
                userId:resetEntry.dataValues.userId
              })

            }

        }
      )
      .then((userlocal)=>{

        return models.Resetpassword.update({
          deletedAt:moment().format()
        },
        {
          where:{userId:resetEntry.dataValues.userId , key:resetEntry.dataValues.key}
        }
        )


      })
      .then(()=>{
        return res.redirect('/login');
      })

      }
      else {

        return models.Resetpassword.update({
          deletedAt:moment().format()
        },
        {
          where:{userId:resetEntry.dataValues.userId , key:resetEntry.dataValues.key}
        }
      ).then(function(){

        req.flash('error', 'Reset password Key expired. Please try again.');
        return res.redirect('/forgotpassword');

      });


      }

    })
    .catch (function (err) {
        // Could not register user
	 Raven.captureException(err);
         console.log(err);
         req.flash('error', 'There was some problem setting your password. Please try again.');
         return res.render('resetpassword/setnewpassword',{title: "Setnewpassword | OneAuth" , key:req.params.key});
    });
});

module.exports = router;
