/**
 * Created by himank on 15/12/17.
 *
 * This is the resetpassword path
 */
const router = require('express').Router();
const models = require('../db/models').models;
const passutils = require('../utils/password');
const makeGaEvent = require('../utils/ga').makeGaEvent;
const mail = require('../utils/email');
const moment =require('moment');
const uid = require('uid2');
const Raven = require('raven');

router.post('/', makeGaEvent('submit', 'form', 'resetpassword'), function (req, res) {

  if(req.body.email.trim() === '') {
    req.flash('error', 'Email cannot be empty');
    return res.redirect('/forgotpassword')
  }
   
  models.User.findAll({where:{email:req.body.email}})
  .then((users)=> {

         let promises=[];
         users.map(user => {

            let rKey = uid(15);

            promises.push(models.Resetpassword.create({
              key: rKey,
              userId: user.dataValues.id,
              include:[models.User]
            })
            .then((entry)=>{
                return mail.forgotPasswordEmail(user.dataValues , entry.key)
              })
            );

          });

          return Promise.all(promises)

    })
    .then((dataValues)=>{

      if(dataValues.length){

        return res.redirect('/forgotpassword/inter');

      }
      else {

        req.flash('error', 'This email id is not registered with codingblocks. Please enter your registered email.');
        return res.redirect('/forgotpassword');
      }

    })
    .catch (function (err) {
        Raven.captureException(err);
        console.error(err.toString());
        req.flash('error', 'Something went wrong. Please try again with your registered email.');
        return res.redirect('/forgotpassword');
    });
});

module.exports = router;
