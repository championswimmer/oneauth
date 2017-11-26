/**
 * Created by himank on 24/11/17.
 */
const router = require('express').Router();
const models = require('../../db/models').models;

function DisconnectGithub(req,res) {

  let existingUser = req.user;
  let isGithubConnected = models.UserGithub.findOne({
    where: {userId: existingUser.id}
    })
    .then(function(user){

      if(user) {
        return true;
      }
      else {
        return false;
      }

  })
  .catch((err) => console.log(err))

  if(existingUser && isGithubConnected) {

    models.UserGithub.destroy({
      where: {userId: req.user.id}
    })
    .then(function(result) {
      return res.redirect('/users/me');
      })
      .catch((err) => console.log(err))

  }
  else{
    // TODO: handle this condition:: give user some feedback like github not connected or not logged in.
  }

}


module.exports = DisconnectGithub;
