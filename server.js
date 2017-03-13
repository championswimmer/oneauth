/**
 * Created by championswimmer on 08/03/17.
 */
const express = require('express')
    , bodyParser = require('body-parser')
    , session = require('express-session')
    , passport = require('./passport/passporthandler')
    , path = require('path')
    , exphbs = require('express-hbs');

const secrets = require('./secrets.json')
    , config = require('./config.json')
    , loginrouter = require('./routers/loginrouter')
    , signuprouter = require('./routers/signup')
    , apirouter = require('./routers/apirouter')
    , oauthrouter = require('./routers/oauthrouter')
    , pagerouter = require('./routers/pagerouter');

const app = express();

app.engine('hbs', exphbs.express4({
    partialsDir: path.join(__dirname, 'views/partials'),
    layoutsDir: path.join(__dirname, 'views/layouts'),
    defaultLayout: path.join(__dirname, 'views/layouts/main.hbs'),
}));
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "hbs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: secrets.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/login', loginrouter);
app.use('/signup', signuprouter);
app.use('/api', apirouter);
app.use('/oauth', oauthrouter);
app.use('/', pagerouter);
app.use(express.static(path.join(__dirname, 'public_static')));

app.listen(3838, function () {
    console.log("Listening on " + config.SERVER_URL );
});



