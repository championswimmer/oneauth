/**
 * Created by championswimmer on 09/03/17.
 *
 * This is the /signup path
 */
const Raven = require('raven')
const router = require('express').Router()
const models = require('../db/models').models
const passutils = require('../utils/password')
const makeGaEvent = require('../utils/ga').makeGaEvent
const mail = require('../utils/email')
const { findUserByParams, createUserLocal } = require('../controllers/user')

router.post('/', makeGaEvent('submit', 'form', 'signup'), async (req, res) => {

    if (req.body.username.trim() === '') {
        req.flash('error', 'Username cannot be empty')
        return res.redirect('/signup')
    }
    if ((req.body.firstname.trim() === '') || (req.body.lastname.trim() === '')) {
        req.flash('error', 'Firstname and/or Lastname cannot be empty')
        return res.redirect('/signup')
    }
    if ((req.body.gender.trim() === '')) {
        req.flash('error', 'Gender cannot be empty')
        return res.redirect('/signup')
    }
    if (req.body.email.trim() === '') {
        req.flash('error', 'Email cannot be empty')
        return res.redirect('/signup')
    }
    if (req.body.mobile_number.trim() === '') {
        req.flash('error', 'Contact number cannot be empty')
        return res.redirect('/signup')
    }
    if ((req.body.password.trim() === '') || req.body.password.length < 5) {
        req.flash('error', 'Password too weak. Use 5 characters at least.')
        return res.redirect('/signup')
    }

    try {

        const User = await findUserByParams({username: req.body.username})
        if (User) {
            req.flash('error', 'Username already exists. Please try again.')
            return res.redirect('/signup')
        }

        const passhash = await passutils.pass2hash(req.body.password)
        const query = {
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            demographic: {
                branchId: req.body.branchId,
                collegeId: req.body.collegeId,
            }

          let includes = [{model: models.User, include: [models.Demographic]}]
          const user = await createUserLocal(query, passhash, includes)

          mail.welcomeEmail(user.user.dataValues)
          res.redirect('/login')

     } catch(err) {
        Raven.captureException(err)
        req.flash('error', 'Unsuccessful registration. Please try again.')
        return res.redirect('/signup')
    }
})

module.exports = router
