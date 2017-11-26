/**
 * Created by himank on 24/11/17.
 */
const router = require('express').Router();
const models = require('../../db/models').models;

function DisconnectGithub(req,res) {

  models.UserGithub.destroy({
    where: {userId: req.user.id}
  })
  .then(function(user) {
    res.redirect('/users/me');
  })
  .catch((err) => console.log(err))

}


module.exports = DisconnectGithub;
