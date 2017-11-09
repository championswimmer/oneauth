/**
 * Created by championswimmer on 08/03/17.
 */
const express = require('express')
    , bodyParser = require('body-parser')
    , session = require('express-session')
    , passport = require('./passport/passporthandler')
    , path = require('path')
    , cookieParser = require('cookie-parser')
    , exphbs = require('express-hbs')
    , expressGa = require('express-ga-middleware')
    , flash = require('express-flash')
    , Raven = require('raven')
    , connectDatadog = require('connect-datadog')

const secrets = require('./secrets.json')
    , config = require('./config')
    , loginrouter = require('./routers/login')
    , connectrouter = require('./routers/connect')
    , logoutrouter = require('./routers/logoutrouter')
    , signuprouter = require('./routers/signup')
    , apirouter = require('./routers/api')
    , oauthrouter = require('./routers/oauthrouter')
    , pagerouter = require('./routers/pagerouter');

const app = express();
const datadogRouter = connectDatadog({
  'response_code':true,
  'tags': ['app:oneauth']
})
const redirectToHome = function (req, res, next) {

    if (req.path == '/') {
        return res.redirect('/users/me');
    }

    next();

};

Raven.config(secrets.SENTRY_DSN).install()
app.use(Raven.requestHandler())

app.engine('hbs', exphbs.express4({
    partialsDir: path.join(__dirname, 'views/partials'),
    layoutsDir: path.join(__dirname, 'views/layouts'),
    defaultLayout: 'views/layouts/main.hbs',
}));
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "hbs");

app.use(express.static(path.join(__dirname, 'public_static')));
app.use(cookieParser(secrets.EXPRESS_SESSION_SECRET));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: secrets.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: 'oneauth'
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(redirectToHome);
app.use(expressGa('UA-83327907-7'));
app.use(datadogRouter)
app.use('/login', loginrouter);
app.use('/connect', connectrouter);
app.use('/logout', logoutrouter);
app.use('/signup', signuprouter);
app.use('/api', apirouter);
app.use('/oauth', oauthrouter);
app.use('/', pagerouter);

app.use(Raven.errorHandler());

app.listen(3838, function () {
    console.log("Listening on " + config.SERVER_URL );
});



