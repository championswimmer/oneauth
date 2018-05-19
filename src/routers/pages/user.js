/**
 * Created by championswimmer on 13/03/17.
 */
const Raven = require('raven')
const cel = require('connect-ensure-login')
const router = require('express').Router()
const {hasNull} = require('../../utils/nullCheck')
const passutils = require('../../utils/password')
const models = require('../../db/models').models
const acl = require('../../middlewares/acl')

router.get('/me',
    cel.ensureLoggedIn('/login'),
    function (req, res, next) {

        models.User.findOne({
            where: {id: req.user.id},
            include: [
                models.UserGithub,
                models.UserFacebook,
                models.UserLms,
                models.UserTwitter,
                {
                    model: models.Demographic,
                    include: [
                        models.College,
                        models.Branch,
                        models.Company,
                    ]
                }
            ]
        }).then(function (user) {
            if (!user) {
                res.redirect('/login')
            }
            return res.render('user/me', {user: user})
        }).catch(function (err) {
            throw err
        })

    })

router.get('/me/edit',
    cel.ensureLoggedIn('/login'),
    function (req, res, next) {
        Promise.all([
            models.User.findOne({
                where: {id: req.user.id},
                include: [
                    {
                        model: models.Demographic,
                        include: [
                            models.College,
                            models.Branch,
                            models.Company,
                        ]
                    }
                ]
            }),
            models.College.findAll({}),
            models.Branch.findAll({})
        ]).then(function ([user, colleges, branches]) {
            if (!user) {
                res.redirect('/login')
            }
            return res.render('user/me/edit', {user, colleges, branches})
        }).catch(function (err) {
            throw err
        })

    }
)

router.post('/me/edit',
    cel.ensureLoggedIn('/login'),
    async function (req, res, next) {

        //exit if password doesn't match
        if ((req.body.password) && (req.body.password !== req.body.repassword)) {
            req.flash('error', 'Passwords do not match')
            return res.redirect('edit')
        }

        // Check name isn't null
        if (hasNull(req.body, ['firstname', 'lastname'])) {
            req.flash('error', 'Null values for name not allowed')
            return res.redirect('/')
        }

        try {
            const user = await models.User.findOne({
                where: {id: req.user.id},
                include: [models.Demographic]
            })
            const demographic = user.demographic || {};

            user.firstname = req.body.firstname
            user.lastname = req.body.lastname
            if (!user.verifiedemail && req.body.email !== user.email) {
                user.email = req.body.email
            }
            await user.save()

            demographic.userId = demographic.userId || req.user.id;
            if (req.body.branchId) {
                demographic.branchId = +req.body.branchId
            }
            if (req.body.collegeId) {
                demographic.collegeId = +req.body.collegeId
            }
            await models.Demographic.upsert(demographic, {
                where: {
                    userId: req.user.id
                }
            })

            if (req.body.password) {
                const passHash = await passutils.pass2hash(req.body.password)
                await models.UserLocal.update({
                    password: passHash
                }, {
                    where: {userId: req.user.id}
                })
            }
            res.redirect('/users/me')
        } catch (err) {
            Raven.captureException(err)
            req.flash('error', 'Error in Server')
            return res.redirect('/')
        }

    })

router.get('/:id',
    cel.ensureLoggedIn('/login'),
    acl.ensureRole('admin'),
    function (req, res, next) {

        models.User.findOne({
            where: {id: req.params.id},
            include: [
                models.UserGithub,
                models.UserFacebook,
                models.UserLms,
                models.UserTwitter
            ]
        }).then(function (user) {
            if (!user) {
                return res.status(404).send({error: "Not found"})
            }
            return res.render('user/id', {user: user})
        }).catch(function (err) {
            throw err
        })
    }
)

router.get('/:id/edit',
    cel.ensureLoggedIn('/login'),
    acl.ensureRole('admin'),
    function (req, res, next) {

        models.User.findOne({
            where: {id: req.params.id},
        }).then(function (user) {
            if (!user) {
                return res.status(404).send({error: "Not found"})
            }
            return res.render('user/id/edit', {user: user})
        }).catch(function (err) {
            throw err
        })
    }
)

router.post('/:id/edit',
    cel.ensureLoggedIn('/login'),
    acl.ensureRole('admin'),
    function (req, res, next) {

        models.User.update({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                role: req.body.role !== 'unchanged' ? req.body.role : undefined
            },
            {
                where: {id: req.params.id},
                returning: true
            }).then(function (result) {
            return res.redirect('../' + req.params.id)
        }).catch(function (err) {
            throw err
        })
    }
)

module.exports = router
