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
const multer = require('../../utils/multer')

const {
    findUserById,
    updateUser
} = require('../../controllers/user');
const { findAllClientsByUserId } = require('../../controllers/clients');
const {
    findAllBranches,
    findAllColleges,
    findDemographic,
    upsertDemographic
} = require("../../controllers/demographics");

router.get('/me',
    cel.ensureLoggedIn('/login'),
    async function (req, res, next) {
        try {
            const user = await findUserById(req.user.id,[
                models.UserGithub,
                models.UserGoogle,
                models.UserFacebook,
                models.UserLms,
                models.UserTwitter,
                models.UserLinkedin,
                {
                    model: models.Demographic,
                    include: [
                        models.College,
                        models.Branch,
                        models.Company,
                    ]
                }
            ]);
            if (!user) {
                res.redirect('/login')
            }
            return res.render('user/me', {user: user})
        } catch (error) {
            Raven.captureException(error)
            res.status(500).json({error: error})
        }
    })

router.get('/me/edit',
    cel.ensureLoggedIn('/login'),
    async function (req, res, next) {
        try {
            const [user, colleges, branches] = await Promise.all([
                findUserById(req.user.id,[
                    {
                        model: models.Demographic,
                        include: [
                            models.College,
                            models.Branch,
                            models.Company,
                        ]
                    }
                ]),
                findAllColleges(),
                findAllBranches()
            ])
            if (!user) {
                res.redirect('/login')
            }
            return res.render('user/me/edit', {user, colleges, branches})
        } catch (error) {
            Raven.captureException(error)
            res.flash('error','Error Fetching College and Branches Data.')
            res.redirect('users/me')
        }

    }
)

router.post('/me/edit',
    cel.ensureLoggedIn('/login'),

    function(req, res, next) {
        var upload = multer.upload.single('userpic')
        upload(req, res, function (err) {
            if(err) {
                if (err.message === 'File too large') {
                    req.flash('error', 'Profile photo size exceeds 2 MB')
                    return res.redirect('edit')
                } else {
                    Raven.captureException(err)
                    req.flash('error', 'Error in Server')
                    return res.redirect('/')
                }
            } else {
                next()
            }
        })
    },
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

        if(req.body.mobile_number.trim() === ''){
            req.flash('error', 'Contact number cannot be empty')
            return res.redirect('/users/me/edit')
        }

        try {
            const user = await findUserById(req.user.id,[models.Demographic])
            // user might have demographic, if not make empty
            const demographic = user.demographic || {};

            user.firstname = req.body.firstname
            user.lastname = req.body.lastname
            if(req.body.gender){
                user.gender = req.body.gender
            }
            user.mobile_number = req.body.mobile_number
            if (!user.verifiedemail && req.body.email !== user.email) {
                user.email = req.body.email
            }

            let prevPhoto = ""
            if (user.photo) {
                prevPhoto = user.photo.split('/').pop()
            }
            if (req.file) {
                user.photo = req.file.location
            } else if(req.body.avatarselect) {
                user.photo = `https://minio.cb.lk/img/avatar-${req.body.avatarselect}.svg`
            }

            await user.save()

            if ((req.file || req.body.avatarselect) && prevPhoto) {
                multer.deleteMinio(prevPhoto)
            }

            // If am empty demographic, then insert userid
            if (!demographic.userId) {
                demographic.userId = req.user.id
            }

            if (req.body.branchId) {
                demographic.branchId = +req.body.branchId
            }
            if (req.body.collegeId) {
                demographic.collegeId = +req.body.collegeId
            }

            await upsertDemographic (
                demographic.id,
                demographic.userId,
                demographic.collegeId,
                demographic.branchId
            )

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

router.get('/me/clients',
    cel.ensureLoggedIn('/login'),
    async function (req, res, next) {
        try {
            const clients = await findAllClientsByUserId(req.user.id);
            return res.render('client/all', {clients: clients})
        } catch (error) {
            Raven.captureException(err)
            req.flash('error','Could not find any clients')
            res.redirect('user/me')
        }
    }
)

module.exports = router
