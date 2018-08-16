/**
 * Created by championswimmer on 13/03/17.
 *
 * This route contains pages that are visible to public (without logging in)
 */
const Raven = require('raven') 
const cel = require('connect-ensure-login')
const router = require('express').Router()
const verifyemail = require('../../routers/verifyemail')
const {
    findAllBranches,
    findAllColleges
} = require('../../controllers/demographics');

router.get('/login', cel.ensureNotLoggedIn('/'), function (req, res, next) {
    res.render('login', {title: "Login | OneAuth", error: req.flash('error')})
})
router.get('/signup', cel.ensureNotLoggedIn('/'), async function (req, res, next) {
    try {
        const [colleges, branches] = await Promise.all([
            findAllColleges(),
            findAllBranches()
        ])
        res.render('signup', {title: "Signup | OneAuth", colleges:colleges, branches:branches})
    } catch (err) {
        Raven.captureException(err)
        res.flash('error','Error Fetching College and Branches Data.')
        res.redirect('/')
    }
})

router.get('/forgot/password/new/:key', cel.ensureNotLoggedIn('/'), function (req, res, next) {
    //FIXME: Check if the key is correct, and prevent rendering if so
    res.render('forgot/password/new', {title: "Setnewpassword | OneAuth", key: req.params.key})
})

router.get('/verifyemail/inter', cel.ensureLoggedIn('/login'), function (req, res, next) {

    res.render('verifyemail/inter', {title: "Verifyemailinter | OneAuth"})

})

router.get('/client/add', cel.ensureLoggedIn('/login'), function (req, res, next) {
        res.render('client/add', {title: "Add New Client | OneAuth"})
    })


module.exports = router
