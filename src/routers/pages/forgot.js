const cel = require('connect-ensure-login')
const models = require('../../db/models').models
const makeGaEvent = require('../../utils/ga').makeGaEvent
const mail = require('../../utils/email')
const Raven = require('raven')
const moment = require('moment')
const uid = require('uid2')
const passutils = require('../../utils/password')
const debug = require('debug')('oauth:pages:forgot')

const router = require('express').Router()

router.use((req, res, next) => {
    if (req.user) {
        return res.redirect('/users/me')
    } else {
        next()
    }
})

router.get('/username', (req, res, next) => {
    res.render('forgot/username/index', {title: "Resetusername | OneAuth"})
})

router.get('/username/inter', (req, res, next) => {
    res.render('forgot/username/inter', {title: "Resetusername | OneAuth"})
})

router.post('/username', makeGaEvent('submit', 'form', 'forgot.username'), function (req, res) {

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
    res.render('forgot/password/index', {title: "Resetpassword | OneAuth"})
})

router.get('/password/inter', (req, res, next) => {
    res.render('forgot/password/inter', {title: "Resetinter | OneAuth"})
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

router.post('/password/new', makeGaEvent('submit', 'form', 'forgot.password.new'), function (req, res) {
  req.body.key = req.body.key.trim()
  req.body.password = req.body.password.trim()
  req.body.passwordagain = req.body.passwordagain.trim()
  if ((req.body.key === '') || req.body.key.length != 15) {

    req.flash('error', 'Invalid key. please try again.')
    return res.redirect('/forgot/password')
  }

  if ((req.body.password === '') || req.body.password.length < 5) {

    req.flash('error', 'Password too weak. Please use at least 5 characters.')
    return res.render('forgot/password/new', {title: "Setnewpassword | OneAuth", key: req.body.key})
  }

  if (req.body.password !== req.body.passwordagain) {

    req.flash('error', 'Password does not match.')
    return res.render('forgot/password/new', {title: "Setnewpassword | OneAuth", key: req.body.key})
  }

  models.Resetpassword.findOne({where: {key: req.body.key}})

    .then((resetEntry) => {

      if (!resetEntry) {
        req.flash('error', 'Invalid key. please try again.')
        return res.redirect('/forgot/password')
      }

      if (moment().diff(resetEntry.createdAt, 'seconds') <= 86400) {

        return models.UserLocal.findOne({
          where: {userId: resetEntry.dataValues.userId}
        })
          .then(function (userlocal) {

            let passhash = passutils.pass2hash(req.body.password)

            return Promise.all([userlocal, passhash])

          })
          .then(([userlocal, passhash]) => {

              if (userlocal) {

                return models.UserLocal.update(
                  {password: passhash},
                  {where: {userId: userlocal.dataValues.userId}}
                )

              } else {

                return models.UserLocal.create({
                  password: passhash,
                  userId: resetEntry.dataValues.userId
                })

              }

            }
          )
          .then((userlocal) => {

            return models.Resetpassword.update({
                deletedAt: moment().format()
              },
              {
                where: {userId: resetEntry.dataValues.userId, key: resetEntry.dataValues.key}
              }
            )


          })
          .then(() => {
            return res.redirect('/login')
          })

      }
      else {

        return models.Resetpassword.update({
            deletedAt: moment().format()
          },
          {
            where: {userId: resetEntry.dataValues.userId, key: resetEntry.dataValues.key}
          }
        ).then(function () {

          req.flash('error', 'Reset password Key expired. Please try again.')
          return res.redirect('/forgot/password')

        })


      }

    })
    .catch(function (err) {
      // Could not register user
      Raven.captureException(err)
      debug(err)
      req.flash('error', 'There was some problem setting your password. Please try again.')
      return res.render('forgot/password/new', {title: "Setnewpassword | OneAuth", key: req.params.key})
    })
})


exports = module.exports = router