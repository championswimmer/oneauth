/**
 * Created by championswimmer on 13/03/17.
 */
const cel = require('connect-ensure-login')

const router = require('express').Router()

const verifyemail = require('../../routers/verifyemail')

const notForLoggedIn = (req, res, next) => {
    if (req.user) {
        return res.redirect('/')
    }
    next()
}

router.get('/login', notForLoggedIn, function (req, res, next) {
    res.render('login', {title: "Login | OneAuth", error: req.flash('error')})
})
router.get('/signup', notForLoggedIn, function (req, res, next) {
    res.render('signup', {title: "Signup | OneAuth"})
})

router.get('/setnewpassword/:key', notForLoggedIn, function (req, res, next) {
    res.render('forgot/password/new', {title: "Setnewpassword | OneAuth", key: req.params.key})
})

router.get('/verifyemail/inter', cel.ensureLoggedIn('/login'), function (req, res, next) {

    res.render('verifyemail/inter', {title: "Verifyemailinter | OneAuth"})

})

router.get('/client/add',
    cel.ensureLoggedIn('/login'),
    function (req, res, next) {
        res.render('client/add', {title: "Add New Client | OneAuth"})
    }
)


module.exports = router
