/**
 * Created by championswimmer on 08/03/17.
 */
const express = require('express')
    , bodyParser = require('body-parser')
    , session = require('express-session')
    , passport = require('./passport/passporthandler')
    , path = require('path');

const secrets = require('./secrets.json')
    , config = require('./config.json')
    , loginrouter = require('./routers/loginrouter')
    , signuprouter = require('./routers/signup')
    , apirouter = require('./routers/apirouter');

const app = express();

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
app.use(express.static(path.join(__dirname, 'public_html')));

app.listen(3838, function () {
    console.log("Listening on " + config.SERVER_URL );
});



