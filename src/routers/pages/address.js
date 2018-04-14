const router = require('express').Router()
const cel = require('connect-ensure-login')
const Raven = require('raven')

const models = require('../../db/models').models

router.get('/',
    cel.ensureLoggedIn('/login'),
    function (req, res, next) {
        models.Address.findAll({
            where: {'$demographic.userId$': req.user.id},
            include: [models.Demographic]
        }).then(function (addresses) {
            return res.render('address/all', {addresses})
        }).catch(function (err) {
            Raven.captureException(err)
            req.flash('error', 'Something went wrong trying to query address database')
            return res.redirect('/users/me')
        })
    }
)

router.get('/add',
    cel.ensureLoggedIn('/login'),
    function (req, res, next) {
        Promise.all([
            models.State.findAll({}),
            models.Country.findAll({})
        ]).then(function ([states, countries]) {
            return res.render('address/add', {states, countries})
        }).catch(function (err) {
            res.send("Error Fetching Data.")
        })
    }
)

router.get('/:id',
    cel.ensureLoggedIn('/login'),
    function (req, res, next) {
        models.Address.findOne({
            where: {
                id: req.params.id,
                '$demographic.userId$': req.user.id
            },
            include: [models.Demographic, models.State, models.Country]
        }).then(function (address) {
            if (!address) {
                return res.send("Invalid Client Id")
            }
            if (address.userId != req.user.id) {
                return res.send("Unauthorized user")
            }

            return res.render('address/id', {address})
        }).catch((err) => {
            Raven.captureException(err)
            req.flash('error', 'Something went wrong trying to query address database')
            return res.redirect('/users/me')
        })
    }
)


router.get('/:id/edit',
    cel.ensureLoggedIn('/login'),
    function (req, res, next) {
        Promise.all([
            models.Address.findOne({
                where: {id: req.params.id},
                include: [{model: models.State}, {model: models.Country}]
            }),
            models.State.findAll({}),
            models.Country.findAll({})
        ]).then(function ([address, states, countries]) {
            if (!address) {
                return res.send("Invalid Address Id")
            }
            if (address.userId != req.user.id) {
                return res.send("Unauthorized user")
            }
            return res.render('address/edit', {address, states, countries})
        }).catch((err) => {
            Raven.captureException(err)
            req.flash('error', 'Something went wrong trying to query address database')
            return res.redirect('/users/me')
        })
    }
)

module.exports = router
