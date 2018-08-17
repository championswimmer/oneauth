/**
 * Created by championswimmer on 13/03/17.
 */
const Raven = require('raven') 
const router = require('express').Router()
const cel = require('connect-ensure-login')
const acl = require('../../middlewares/acl')
const {
    findClientById,
    findAllClients
} =require('../../controllers/clients');

const { 
    findAllEventSubscription
} =require('../../controllers/event_subscriptions');

router.get('/',acl.ensureAdmin, async function (req,res,next) {
    try {
        const clients = await findAllClients();
        return res.render('client/all',{clients:clients})
    } catch (error) {
        Raven.captureException(err)
        req.flash('error','No cLients registered')
        res.redirect('user/me')
    }
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
            const client = await findClientById(req.params.id)
            if (!client) {
                return res.send("Invalid Client Id")
            }
            if (client.userId != req.user.id) {
                return res.send("Unauthorized user")
            }
            return res.render('client/id', {client: client})
        } catch (error) {
            Raven.captureException(error)
            req.flash('error', 'Error Getting Client')
            res.redirect('users/me/clients')
        }
    }
)


router.get('/:id/edit',
    cel.ensureLoggedIn('/login'),
    async function (req, res, next) {
        try {
            const client = await findClientById(req.params.id)
            let eventSubscription = []  
            if (!client) {
                return res.send("Invalid Client Id")
            }
            if (client.userId != req.user.id) {
                return res.send("Unauthorized user")
            }
            client.clientDomains = client.domain.join(";")
            client.clientCallbacks = client.callbackURL.join(";")
            client.clientdefaultURL = client.defaultURL;
            if (client.dataValues.webhookURL) {
                eventSubscription = await findAllEventSubscription (req.params.id)
            }
            let event_subscription = {
                cUser: '',
                uUser: '',
                dUser: '',
                cDemographic: '',
                uDemographic: '',
                dDemographic: '',
                cAddress: '',
                uAddress: '',
                dAddress: '',
                cClient: '',
                uClient: '',
                dClient: ''
            }

            eventSubscription.forEach (event => {
                if (event.model === 'user') {
                    if (event.type === 'create') event_subscription.cUser = '1'
                    else if (event.type === 'update') event_subscription.uUser = '1'
                    else if (event.type === 'delete') event_subscription.dUser = '1'
                }
                else if (event.model === 'demographic') {
                    if (event.type === 'create') event_subscription.cDemographic = '1'
                    if (event.type === 'update') event_subscription.uDemographic = '1'
                    if (event.type === 'delete') event_subscription.dDemographic = '1'
                }
                else if (event.model === 'address') {
                    if (event.type === 'create') event_subscription.cAddress = '1'
                    if (event.type === 'update') event_subscription.uAddress = '1'
                    if (event.type === 'delete') event_subscription.dAddress = '1'
                }
                else if (event.model === 'client') {
                    if (event.type === 'create') event_subscription.cClient = '1'
                    if (event.type === 'update') event_subscription.uClient = '1'
                    if (event.type === 'delete') event_subscription.dClient = '1'
                }
            })

            return res.render('client/edit', {client: client, event_subscription: event_subscription})
        } catch (error) {
            Raven.captureException(error)
            req.flash('error', 'Error Editing Client')
            res.redirect('users/me/clients')
        }
    }
)

module.exports = router
