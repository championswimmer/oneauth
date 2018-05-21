const router = require('express').Router()
const models = require('../../db/models').models

function DisconnectGoogle(req, res) {

    let existingUser = req.user

    if (!existingUser) {

        res.redirect('/')

    }
    else {

        models.UserGoogle.destroy({
            where: {userId: req.user.id}
        })
            .then(function (result) {
                return res.redirect('/users/me')
            })
            .catch((err) => {
                Raven.captureException(err)
                res.status(503).send({message: "There was an error disconnecting Google."})
            })

    }

}


module.exports = DisconnectGoogle