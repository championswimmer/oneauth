/**
 * Created by championswimmer on 13/03/17.
 */
const router = require('express').Router()
const cel = require('connect-ensure-login')
const acl = require('../../middlewares/acl')
const {findClient} =require('../../controllers/clients');

const models = require('../../db/models').models


router.get('/',acl.ensureAdmin,function (req,res,next) {
    models.Client.findAll({})
        .then(function (clients) {
            return res.render('client/all',{clients:clients})
        }).catch(function(err){
            res.send("No clients Registered")
    })
})

router.get('/add',
    cel.ensureLoggedIn('/login'),
    function (req, res, next) {
        return res.render('client/add')
    }
)

router.get('/:id',
    cel.ensureLoggedIn('/login'),
    async function (req, res, next) {
        try {
            const client = findClient(req.params.id)    
            if (!client) {
                return res.send("Invalid Client Id")
            }
            if (client.userId != req.user.id) {
                return res.send("Unauthorized user")
            }
            return res.render('client/id', {client: client})
        } catch (error) {
        }
    }
)


router.get('/:id/edit',
    cel.ensureLoggedIn('/login'),
    async function (req, res, next) {
        try {
            const client = findClient(req.params.id)    
            if (!client) {
                return res.send("Invalid Client Id")
            }
            if (client.userId != req.user.id) {
                return res.send("Unauthorized user")
            }
            client.clientDomains = client.domain.join(";")
            client.clientCallbacks = client.callbackURL.join(";")
            client.clientdefaultURL = client.defaultURL;

            return res.render('client/edit', {client: client})
        } catch (error) {
        }
    }
)

module.exports = router
