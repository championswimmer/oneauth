/**
 * Created by championswimmer on 10/03/17.
 *
 * This is the /api/v1/clients path
 */
const router = require('express').Router()
const cel = require('connect-ensure-login')

const {
    createClient,
    updateClient
} =require('../../controllers/clients');

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
    try {
        const clientid = await createClient(options, req.user.id)
        res.redirect('/clients/' + clientid.id)
    } catch (error) {
        console.log(error)
    }
})

router.post('/edit/:id', cel.ensureLoggedIn('/login'),
    async function (req, res) {
        if(req.user.role === 'admin'){
            options.trustedClient = req.body.trustedClient
        }
        try {
            let clientId = parseInt(req.params.id)
            let options = {
                clientName : req.body.clientname,
                clientDomains : req.body.domain.replace(/ /g, '').split(';'),
                clientCallbacks : req.body.callback.replace(/ /g, '').split(';'),
                defaultURL : req.body.defaulturl.replace(/ /g, ''),
                trustedClient : false
            }
            await updateClient(options, clientId)
            res.redirect('/clients/' + clientId)
        } catch (error) {
            console.error(error)
        }
    })

module.exports = router