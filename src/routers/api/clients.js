/**
 * Created by championswimmer on 10/03/17.
 *
 * This is the /api/v1/clients path
 */
const Raven = require('raven') 
const router = require('express').Router()
const cel = require('connect-ensure-login')
const { isURL } = require('../../utils/urlutils')
const {
    createClient,
    updateClient
} =require('../../controllers/clients');

const {
    createEventSubscriptionBulk,
    deleteEventSubscription
} = require ('../../controllers/event_subscriptions');

function getEvent (id, model, type) {
    return {
        clientId: id,
        model: model,
        type: type
    }
}

router.post('/add', async function (req, res) {
    if (!req.user) {
        return res.status(403).send("Only logged in users can make clients")
    }

    let options = {
        clientName : req.body.clientname,
        clientDomains : req.body.domain.replace(/ /g, '').split(';'),
        clientCallbacks : req.body.callback.replace(/ /g, '').split(';'),
        defaultURL : req.body.defaulturl.replace(/ /g, '')
    }

    if (req.body.webhookURL && isURL(req.body.webhookURL)) {
      options.webhookURL = req.body.webhookURL
    }
    try {
        const clientid = await createClient(options, req.user.id)
        res.redirect('/clients/' + clientid.id)
    } catch (error) {
        Raven.captureException(err)
        req.flash('error', 'Could not create client')
        res.redirect('/users/me')
    }
})

router.post('/edit/:id', cel.ensureLoggedIn('/login'),
    async function (req, res) {
        try {
            let clientId = parseInt(req.params.id)
            let options = {
                clientName : req.body.clientname,
                clientDomains : req.body.domain.replace(/ /g, '').split(';'),
                clientCallbacks : req.body.callback.replace(/ /g, '').split(';'),
                defaultURL : req.body.defaulturl.replace(/ /g, ''),
                trustedClient : false
            }
            if(req.user.role === 'admin'){
                options.trustedClient = req.body.trustedClient
            }
            if (req.body.webhookurl && isURL(req.body.webhookurl)){
                options.webhookURL = req.body.webhookurl
            }
            await updateClient(options, clientId)

            await deleteEventSubscription (req.params.id)

            let event_subscription = []
            // --------------------- User ------------------------------ //
            if (req.body.event_c_user) {
                event_subscription.push (getEvent (req.params.id, 'user', 'create'))
            }
            if (req.body.event_u_user) {
                event_subscription.push (getEvent (req.params.id, 'user', 'update'))
            }
            if (req.body.event_d_user) {
                event_subscription.push (getEvent (req.params.id, 'user', 'delete'))
            }

            // --------------------- Demographics ------------------------------ //

            if (req.body.event_c_demographics) {
                event_subscription.push (getEvent (req.params.id, 'demographic', 'create'))
            }
            if (req.body.event_u_demographics) {
                event_subscription.push (getEvent (req.params.id, 'demographic', 'update'))
            }
            if (req.body.event_d_demographics) {
                event_subscription.push (getEvent (req.params.id, 'demographic', 'delete'))
            }

            // --------------------- Address ------------------------------ //

            if (req.body.event_c_address) {
                event_subscription.push (getEvent (req.params.id, 'address', 'create'))
            }
            if (req.body.event_u_address) {
                event_subscription.push (getEvent (req.params.id, 'address', 'update'))
            }
            if (req.body.event_d_address) {
                event_subscription.push (getEvent (req.params.id, 'address', 'delete'))
            }

            // --------------------- Client ------------------------------ //

            if (req.body.event_c_client) {
                event_subscription.push (getEvent (req.params.id, 'client', 'create'))
            }
            if (req.body.event_u_client) {
                event_subscription.push (getEvent (req.params.id, 'client', 'update'))
            }
            if (req.body.event_d_client) {
                event_subscription.push (getEvent (req.params.id, 'client', 'delete'))
            }

            await createEventSubscriptionBulk (event_subscription)

            res.redirect('/clients/' + clientId)
        } catch (err) {
            Raven.captureException(err)
            req.flash('error', 'Could not update client')
            res.redirect('/users/me')
        }
    })

module.exports = router
