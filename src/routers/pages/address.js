const router = require('express').Router()
const cel = require('connect-ensure-login')

const models = require('../../db/models').models

router.get('/',
    cel.ensureLoggedIn('/login'),
    function (req, res, next) {
        models.AddressBook.findAll({
            where: {userId: req.user.id}
        }).then(function (addresses) {
            return res.render('address/all', {addresses: addresses})
        }).catch(function (err) {
            res.send("No Address registered")
        })
    }
)

router.get('/add',
    cel.ensureLoggedIn('/login'),
    function (req, res, next) {
        Promise.all([
            models.State.findAll({}), 
            models.Country.findAll({})
        ]).then(function (result) {
            return res.render('address/add',{states:result[0],countries:result[1]})
        }).catch(function (err) {
            res.send("Error Fetching Data.")
        })
    }
)

router.get('/:id',
    cel.ensureLoggedIn('/login'),
    function (req, res, next) {
        models.AddressBook.findOne({
            where: {id: req.params.id},
            include:[{model:models.State}, {model:models.Country}]
        }).then(function (address) {
            if (!address) {
                return res.send("Invalid Client Id")
            }
            if (address.userId != req.user.id) {
                return res.send("Unauthorized user")
            }

            return res.render('address/id', {address: address})
        })
    }
)


router.get('/:id/edit',
    cel.ensureLoggedIn('/login'),
    function (req, res, next) {
        Promise.all([
            models.AddressBook.findOne({
                where: {id: req.params.id},
                include:[{model:models.State}, {model:models.Country}]
            }),
            models.State.findAll({}), 
            models.Country.findAll({})
        ]).then(function (result) {
            if (!result[0]) {
                return res.send("Invalid Address Id")
            }
            if (result[0].userId != req.user.id) {
                return res.send("Unauthorized user")
            }
            return res.render('address/edit', { address: result[0], states:result[1], countries:result[2] })
        })
    }
)

module.exports = router

