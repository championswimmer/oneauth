/**
 * Created by himank on 24/11/17.
 */
const router = require('express').Router();
const models = require('../../db/models').models;

function DisconnectTwitter(req,res) {

  let existingUser = req.user;

  if(!existingUser){

    res.redirect('/');

  }
  else {

    models.UserTwitter.destroy({
      where: {userId: req.user.id}
    })
    .then(function(result) {
      return res.redirect('/users/me');
      })
      .catch((err) => console.log(err))

  }

}


module.exports = DisconnectTwitter;
