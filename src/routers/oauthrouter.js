/**
 * Created by championswimmer on 10/03/17.
 *
 * This is the /oauth path
 */
const router = require('express').Router()
const OauthMiddewares = require('../oauth/oauthserver').Middlewares
const { authLimiter } = require('../middlewares/ratelimit')

router.use(authLimiter)
router.get('/authorize', OauthMiddewares.authorizationMiddleware)
router.post('/dialog/authorize/decision', OauthMiddewares.decisionMiddleware)
router.post('/token', OauthMiddewares.tokenMiddleware)
module.exports = router
