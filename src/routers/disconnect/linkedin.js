const router = require('express').Router()
const models = require('../../db/models').models

function DisconnectLinkedin(req, res) {

     let existingUser = req.user

     if (!existingUser) {
         req.flash('error','Account doesn\'t exist.')
         res.redirect('/')
     }

     else {

        models.UserLinkedin.destroy({
            where: {userId: req.user.id}
        })
            .then(function (result) {
                return res.redirect('/users/me')
            })
            .catch((err) => {
                Raven.captureException(err)
                res.status(503).send({message: "There was an error disconnecting Linkedin."})
            })
     }
 }
 module.exports = DisconnectLinkedin
