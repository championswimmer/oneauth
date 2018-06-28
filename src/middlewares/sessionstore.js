const session = require('express-session')
const Sequelize = require('sequelize')
const SequelizeSessionStore = require('connect-session-sequelize')(session.Store)
const reqIp = require('request-ip')
const proxyaddr = require('proxy-addr')


const DataTypes = Sequelize.DataTypes
const db = require('../db/models').db

// We trust local ips, first untrusted is outside this
const proxyfilter = proxyaddr.compile(['loopback', 'linklocal', 'uniquelocal'])

const sessions = db.define('session', {
    sid: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    userId: DataTypes.INTEGER,
    ipAddr: DataTypes.STRING(39),
    realIp: DataTypes.STRING(39),
    proxyPath: DataTypes.ARRAY(DataTypes.STRING),
    expires: DataTypes.DATE,
    data: DataTypes.STRING(50000)
})
const extendDefaultFields = (defaults, session) => ({
    data: defaults.data,
    expires: defaults.expires,
    userId: session.passport && session.passport.user,
    ipAddr: session.ipAddr,
    realIp: session.realIp,
    proxyPath: session.proxyPath
})
const sessionStore = new SequelizeSessionStore({
    db,
    table: 'session',
    extendDefaultFields
})
sessionStore.sync()

function saveIp (req, res, next) {
    if (req.session) {
        req.session.ipAddr = reqIp.getClientIp(req)
        req.session.realIp = proxyaddr(req, proxyfilter)
        req.session.proxyPath = proxyaddr.all(req)
    }
    next()
}

module.exports = {
    sessionStore,
    saveIp
}