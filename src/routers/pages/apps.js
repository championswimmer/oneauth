/**
 * Created by bhavyaagg on 19/05/18.
 */
const router = require('express').Router()
const cel = require('connect-ensure-login')
const Raven = require('raven')

const {
    findAuthTokensByUserId,
    findAuthToken
} = require('../../controllers/oauth');

router.get('/',
    cel.ensureLoggedIn('/login'),
    async function (req, res, next) {
        try{
            const apps = await findAuthTokensByUserId(req.user.id);
            return res.render('apps/all', {apps: apps})
        } catch(error){
            Raven.captureException(err)
            req.flash('error','No Clients registered')
            res.redirect('user/me')
        }
    }
)

router.get('/:clientId/delete',cel.ensureLoggedIn('/login'),
    async function (req, res, next) {
        try {
            const token  = await findAuthToken(+req.params.clientId,req.user.id)
            if (!token) {
                return res.send("Invalid App")
            }
            if (token.userId != req.user.id) {
                return res.send("Unauthorized user")
            }
            token.destroy();
            return res.redirect('/apps/')
        } catch (err) {
            Raven.captureException(err)
            req.flash('error', 'Something went wrong, could not delete app')
            res.redirect('/apps/')
        }
    }
)



module.exports = router
