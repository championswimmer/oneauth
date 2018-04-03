const router = require('express').Router()
const models = require('../../db/models').models
const generator = require('../../utils/generator')
const cel = require('connect-ensure-login')

const urlutils = require('../../utils/urlutils')

router.post('/add', cel.ensureLoggedIn('/login'), function (req, res) {

    models.AddressBook.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        mobile_number: req.body.number,
        email: req.body.email,
        pincode: req.body.pincode,
        street_address: req.body.street_address,
        landmark: req.body.landmark,
        city: req.body.city,
        stateId: req.body.stateId,
        countryId: req.body.countryId,
        userId: req.user.id,
        primary: false
    }).then(function (address) {
        res.redirect('/address/' + address.id)
    }).catch(err => console.log(err))
})

router.post('/edit/:id', cel.ensureLoggedIn('/login'), function (req, res) {
    let id = parseInt(req.params.id)
    models.AddressBook.update({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        mobile_number: req.body.number,
        email: req.body.email,
        pincode: req.body.pincode,
        street_address: req.body.street_address,
        landmark: req.body.landmark,
        city: req.body.city,
        stateId: req.body.stateId,
        countryId: req.body.countryId,
        userId: req.user.id,
        primary: req.body.primary === 'on' ? true : false
    }, {
        where: {id: id}
    }).then(function (address) {
        res.redirect('/address/' + id)
    }).catch(function (error) {
        console.error(error)
    })

})


module.exports = router

