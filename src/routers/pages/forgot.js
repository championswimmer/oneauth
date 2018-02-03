const cel = require('connect-ensure-login')
const models = require('../../db/models').models
const makeGaEvent = require('../../utils/ga').makeGaEvent
const mail = require('../../utils/email')
const Raven = require('raven')
const moment = require('moment')
const uid = require('uid2')

const router = require('express').Router()

router.use((req, res, next) => {
    if (req.user) {
        return res.redirect('/users/me')
    } else {
        next()
    }
})

router.get('/username', (req, res, next) => {
    res.render('forgotusername/forgotusername', {title: "Resetusername | OneAuth"})
})

router.get('/username/inter', (req, res, next) => {
    res.render('forgotusername/inter', {title: "Resetusername | OneAuth"})
})

router.post('/username', makeGaEvent('submit', 'form', 'forgotusername'), function (req, res) {

    if (req.body.email.trim() === '') {
        req.flash('error', 'Email cannot be empty')
        return res.redirect('/signup')
    }

    models.User.findAll({where: {email: req.body.email}})
        .then((users) => Promise.all(users.map(user =>
            mail.forgotUserEmail(user.dataValues))
        )).then((dataValues) => {

        if (dataValues.length) {
            return res.redirect('/forgot/username/inter')
        } else {
            req.flash('error',
                'This email id is not registered with codingblocks. ' +
                'Please enter your registered email.'
            )
            return res.redirect('/forgot/username')
        }

    }).catch((err) => {
        Raven.captureException(err)
        console.error(err)
        req.flash('error', 'Something went wrong. Please try again.')
        return res.redirect('/forgot/username')
    })
})

router.get('/password', (req, res, next) => {
    res.render('resetpassword/resetpassword', {title: "Resetpassword | OneAuth"})
})

router.get('/password/inter', (req, res, next) => {
    res.render('resetpassword/inter', {title: "Resetinter | OneAuth"})
})

router.post('/password', makeGaEvent('submit', 'form', 'resetpassword'), function (req, res) {

    if (req.body.email.trim() === '') {
        req.flash('error', 'Email cannot be empty')
        return res.redirect('/forgot/password')
    }

    models.User.findAll({
        where: {
            email: req.body.email
        }
    }).then((users) =>
        Promise.all(users.map(user => models.Resetpassword.create({
                key: uid(15),
                userId: user.dataValues.id,
                include: [models.User]
            }).then((entry) =>
                mail.forgotPasswordEmail(user.dataValues, entry.key)
            )
        ))
    ).then((dataValues) => {

        if (dataValues.length) {
            return res.redirect('/forgot/password/inter')
        } else {
            req.flash('error',
                'This email id is not registered with codingblocks. ' +
                'Please enter your registered email.')
            return res.redirect('/forgot/password')
        }

    }).catch(function (err) {
        Raven.captureException(err)
        console.error(err.toString())
        req.flash('error', 'Something went wrong. Please try again with your registered email.')
        return res.redirect('/forgot/password')
    })
})
exports = module.exports = router