/**
 * Created by bhavyaagg on 19/05/18.
 */
const router = require('express').Router()
const cel = require('connect-ensure-login')

const { 
    findAuthTokensByClientId,
    findAuthToken 
} = require('../../controllers/oauth');

router.get('/',
    cel.ensureLoggedIn('/login'),
    async function (req, res, next) {
        try{
            const apps = await findAuthTokensByClientId(req.user.id);
            return res.render('apps/all', {apps: apps})
        } catch(error){
            res.send("No clients registered")
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
        } catch (error) {
            return res.send("Invalid App")
        }
    }
)



module.exports = router
