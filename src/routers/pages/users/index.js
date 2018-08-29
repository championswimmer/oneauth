/**
 * Created by championswimmer on 13/03/17.
 */
const Raven = require('raven')
const cel = require('connect-ensure-login')
const router = require('express').Router()
const models = require('../../../db/models').models
const acl = require('../../../middlewares/acl')

const {
    findUserById,
    updateUser
} = require('../../../controllers/user');

const meRoute = require('./me')

router.use('/me', meRoute)

router.get('/:id',
    cel.ensureLoggedIn('/login'),
    acl.ensureRole('admin'),
    async function (req, res, next) {
        try {
            const user = await findUserById(req.params.id,[
                models.UserGithub,
                models.UserGoogle,
                models.UserFacebook,
                models.UserLms,
                models.UserTwitter
            ])
            if (!user) {
                return res.status(404).send({error: "Not found"})
            }
            return res.render('user/id', {user: user})
        } catch (err) {
            Raven.captureException(err)
            req.flash('error','Could not fetch user')
            res.redirect('user/me')
        }
    }
)

router.get('/:id/edit',
    cel.ensureLoggedIn('/login'),
    acl.ensureRole('admin'),
    async function (req, res, next) {
        try {
            const user = await findUserById(req.params.id)
            if (!user) {
                return res.status(404).send({error: "Not found"})
            }
            return res.render('user/id/edit', {user: user})
        } catch (err) {
            Raven.captureException(err)
            req.flash('error', 'Error in Server')
            res.redirect('user/id')
        }
    }
)

router.post('/:id/edit',
    cel.ensureLoggedIn('/login'),
    acl.ensureRole('admin'),
    async function (req, res, next) {
        try {
            const user = await updateUser(req.params.id,{
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                gender:req.body.gender,
                email: req.body.email,
                mobile_number: req.body.mobile_number,
                role: req.body.role !== 'unchanged' ? req.body.role : undefined
            })
            return res.redirect('../' + req.params.id);
        } catch (error) {
            Raven.captureException(err)
            req.flash('error','Could not update User')
            res.redirect('user/id')
        }
    }
)

module.exports = router
