const session = require('express-session')
const Sequelize = require('sequelize')
const SequelizeSessionStore = require('connect-session-sequelize')(session.Store)
const reqIp = require('request-ip')

const db = require('../db/models').db

const sessions = db.define('session', {
    sid: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    userId: Sequelize.INTEGER,
    ipAddr: Sequelize.STRING(39),
    expires: Sequelize.DATE,
    data: Sequelize.STRING(50000)
})
const extendDefaultFields = (defaults, session) => ({
    data: defaults.data,
    expires: defaults.expires,
    userId: session.passport && session.passport.user,
    ipAddr: session.ip
})
const sessionStore = new SequelizeSessionStore({
    db,
    table: 'session',
    extendDefaultFields
})
sessionStore.sync()

function saveIp (req, res, next) {
    if (req.session) {
        req.session.ip = reqIp.getClientIp(req)
    }
    next()
}

module.exports = {
    sessionStore,
    saveIp
}