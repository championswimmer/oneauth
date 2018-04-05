const router = require('express').Router();
const models = require('../../db/models').models;
const generator = require('../../utils/generator');
const cel = require('connect-ensure-login');
const Raven = require('raven');
const urlutils = require('../../utils/urlutils');
const { hasNull } = require('../../utils/nullCheck');

router.post('/add', cel.ensureLoggedIn('/login'), function (req, res) {
    if(hasNull(req.body)) {
        res.send(400);
    } else {
        models.AddressBook.create({
            label: req.body.label,
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
        }).catch(err => Raven.captureException(err))
    }
})

router.post('/edit/:id', cel.ensureLoggedIn('/login'), function (req, res) {
    if(hasNull(req.body)) {
        res.send(400);
    } else {
        let id = parseInt(req.params.id);
        if (req.body.primary === 'on' ? true : false) {
            console.log("HELLO");
            models.AddressBook.update({
                primary:false
            },{where: {userId:req.user.id}}).then( _ => {
                return models.AddressBook.update({
                    label: req.body.label,
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
                });
            }).then(function (address) {
                res.redirect('/address/' + id)
            }).catch(function (error) {
                Raven.captureException(error)
            })
        } else {
            models.AddressBook.update({
                label: req.body.label,
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
                Raven.captureException(error)
            })
        }
    }
})


module.exports = router

