/**
 * Created by championswimmer on 08/03/17.
 */

require('newrelic')
const express = require('express')
    , bodyParser = require('body-parser')
    , session = require('express-session')
    , passport = require('./passport/passporthandler')
    , path = require('path')
    , exphbs = require('express-hbs')
    , expressGa = require('express-ga-middleware')
    , flash = require('express-flash')
    , Raven = require('raven')
    , debug = require('debug')('oneauth:server')

const config = require('../config')
    , secrets = config.SECRETS
    , {sessionStore} = require('./middlewares/sessionstore')
    , loginrouter = require('./routers/login')
    , connectrouter = require('./routers/connect')
    , disconnectrouter = require('./routers/disconnect')
    , logoutrouter = require('./routers/logoutrouter')
    , signuprouter = require('./routers/signup')
    , verifyemailrouter = require('./routers/verifyemail')
    , apirouter = require('./routers/api')
    , oauthrouter = require('./routers/oauthrouter')
    , pagerouter = require('./routers/pages')
    , statusrouter = require('./routers/statusrouter')
    , {expresstracer, datadogRouter} = require('./utils/ddtracer')
    , {expressLogger} = require('./utils/logger'),
      handlebarsHelpers = require('./utils/handlebars');

const app = express()


// ============== START DATADOG
app.use(expresstracer)
// ================= END DATADOG
const redirectToHome = function (req, res, next) {

    if (req.path == '/') {
        return res.redirect('/users/me')
    }

    next()

}
const setuserContext = function (req, res, next) {
    if (req.user) {
        Raven.setContext({
            user: {
                username: req.user.dataValues.username,
                id: req.user.dataValues.id
            }

        })

    }
    next()
}
// ====================== START SENTRY
Raven.config(secrets.SENTRY_DSN).install()
app.use(Raven.requestHandler())
// ====================== END SENTRY

app.engine('hbs', exphbs.express4({
    partialsDir: path.join(__dirname, '../views/partials'),
    layoutsDir: path.join(__dirname, '../views/layouts'),
    defaultLayout: 'views/layouts/main.hbs',
}))
app.set('views', path.join(__dirname, '../views'))
app.set("view engine", "hbs")

app.use(expressLogger)
app.use(express.static(path.join(__dirname, '../public_static')))
app.use(express.static(path.join(__dirname, '../submodules/motley/examples/public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(session({
    store: sessionStore,
    secret: secrets.EXPRESS_SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: 'oneauth',
    cookie: {
        domain: config.COOKIE_DOMAIN
    }
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(setuserContext)
app.use(redirectToHome)
app.use(expressGa('UA-83327907-7'))
app.use(datadogRouter)
app.use('/login', loginrouter)
app.use('/connect', connectrouter)
app.use('/disconnect', disconnectrouter)
app.use('/logout', logoutrouter)
app.use('/signup', signuprouter)
app.use('/verifyemail', verifyemailrouter)
app.use('/api', apirouter)
app.use('/oauth', oauthrouter)
app.use('/status', statusrouter)
app.use('/', pagerouter)

app.use(Raven.errorHandler())

if(process.env.ONEAUTH_DEV === 'localhost'){
    Raven.captureException = (E) => console.error (E)
}

app.listen(process.env.PORT || 3838, function () {
    debug("Listening on " + config.SERVER_URL)
})
