/**
 * Created by himank on 4/1/18.
 *
 * This is the verify email path
 */
const router = require('express').Router();
const models = require('../db/models').models;
const makeGaEvent = require('../utils/ga').makeGaEvent;
const mail = require('../utils/email');
const moment = require('moment');
const Raven = require('raven');
const uid = require('uid2');
const cel = require('connect-ensure-login');

router.post('/', cel.ensureLoggedIn('/login'), makeGaEvent('submit', 'form', 'verifyemail'), function (req, res, next) {
    
    if (req.body.email.trim() === '') {
        req.flash('error', 'Email cannot be empty');
        return res.redirect('/verifyemail')
    }
    // Find user with verified email if exists
    models.User.findOne({
        where: { verifiedemail: req.body.email}
    })
        .then((user) => {

            if (user) {
                // Email already verified, take person to profile page
                req.flash('error', 'Email already verified with codingblocks account ID:' + user.get('id'));
                return res.redirect('/users/me');
            }
            else {
                //Email not verified, go to next middleware
                next();
            }
        })

}, function (req, res) {

    let user;
    if (req.user.email) {
        // User already has email id in data
        user = models.User.findOne({where: {email: req.body.email, id: req.user.id}});
    }
    else {
        // User does not have email in profile data, add from query
        user = models.User.update(
            {email: req.body.email},
            {
                where: {
                    id: req.user.id
                }
            })
            .then(() => {
                return models.User.findOne({where: {email: req.body.email, id: req.user.id}})
            });
    }

    user.then((user) => {

        if (!user) {
            return user;
        }

        //Email verification token
        let uniqueKey = uid(15);

        return models.Verifyemail.create({
            key: uniqueKey,
            userId: user.dataValues.id,
            include: [models.User]
        })
            .then((entry) => {
                return mail.verifyEmail(user.dataValues, entry.key)
            })

    })
        .then((dataValue) => {

            if (dataValue) {
                return res.redirect('/verifyemail/inter');
            }
            else {
                req.flash('error', 'The email id entered is not registered with this codingblocks account. Please enter your registered email.');
                return res.redirect('/users/me');
            }
        })
        .catch(function (err) {
	    Raven.captureException(err);
            console.error(err.toString());
            req.flash('error', 'Something went wrong. Please try again with your registered email.');
            return res.redirect('/users/me');
        });
});

router.get('/key/:key', function (req, res) {

    if ((req.params.key === '') || req.params.key.length < 15) {
        req.flash('error', 'Invalid key. please try again.');
        return res.redirect('/users/me');
    }

    models.Verifyemail.findOne({where: {key: req.params.key}})

        .then((resetEntry) => {

            if (!resetEntry) {
                req.flash('error', 'Invalid key. please try again.');
                return [];
            }

            if (resetEntry.deletedAt) {
                return [];
            }

            if (req.user) {
			
                if (req.user.dataValues.id !== resetEntry.dataValues.userId) {

                    req.flash('error', 'Key authorization failed.');
                    return [];
                }
            }

            if (moment().diff(resetEntry.createdAt, 'seconds') <= 86400) {

                return Promise.all([models.Verifyemail.update({
                        deletedAt: moment().format()
                    },
                    {
                        where: {userId: resetEntry.dataValues.userId, key: resetEntry.dataValues.key}
                    }), models.User.findOne({
                    where: {id: resetEntry.dataValues.userId}
                })]);

            }
            else {

                req.flash('error', 'Key expired. Please try again.');
                return [];
            }


        })
        .then(([updates, user]) => {

            if (req.user) {
                if (req.user.dataValues.verifiedemail) {
                    req.flash('info', 'Your email is already verified.');
                    return;
                }
            }

            if (updates) {

                return models.User.update({
                        verifiedemail: user.dataValues.email
                    },
                    {where: {id: user.dataValues.id}})
            }
            else {
                return;
            }
        })
        .then((verifiedemail) => {

            if (verifiedemail) {
                req.flash('info', 'Your email is verified. Thank you.');
                return res.redirect('/users/me')
            }
            else {
                return res.redirect('/');
            }

        })
        .catch(function (err) {
	    Raven.captureException(err);
            console.error(err.toString());
            req.flash('error', 'There was some problem verifying your email. Please try again.');
            return res.redirect('/');

        });
})

module.exports = router;

