/**
 * Created by Himank on 26/12/17.
 *
 * This is the forgotusername path
 */
const router = require('express').Router()
const models = require('../db/models').models
const makeGaEvent = require('../utils/ga').makeGaEvent
const mail = require('../utils/email')
const Raven = require('raven')


router.post('/', makeGaEvent('submit', 'form', 'forgotusername'), function (req, res) {

    if (req.body.email.trim() === '') {
        req.flash('error', 'Email cannot be empty')
        return res.redirect('/signup')
    }

    models.User.findAll({where: {email: req.body.email}})
        .then((users) => {
            let promises = []

            users.map(user => {

                promises.push(mail.forgotUserEmail(user.dataValues))

            })

            return Promise.all(promises)

        })
        .then((dataValues) => {

            if (dataValues.length) {


                return res.redirect('/forgotusername/inter')

            }
            else {

                req.flash('error', 'This email id is not registered with codingblocks. Please enter your registered email.')
                return res.redirect('/forgotusername')
            }

        })
        .catch(function (err) {

            Raven.captureException(err)
            console.error(err)
            req.flash('error', 'Something went wrong. Please try again.')
            return res.redirect('/forgotusername')
        })
})

module.exports = router
