// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 5000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
//var MongoStore   = require('connect-mongo')(session);
var MongoStore   = require('connect-mongo');

var path = require('path'); //join method
var configDB = require('./config/database.js');

//pass passport for configuration
require('./config/passport')(passport); 

// configuration ===============================================================
//mongoose.connect(configDB.url, {useMongoClient : true}); // connect to our database - not supported on mongoose upgrade to 6.1.2
mongoose.connect(configDB.url);


// set up our express application
app.use(express.static(path.join(__dirname, 'views')));    //angular and css files
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.set('view engine', 'ejs'); // set up ejs for templating

//required for passport
app.use(session({
    // store: new MongoStore({ mongooseConnection: mongoose.connection,  ttl: 14 * 24 * 60 * 60, autoRemove:'native', collection:'AllSessions' }),
    store: MongoStore.create({mongoUrl: configDB.url}),
    secret: 'foo'
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// use connect-flash for flash messages stored in session
app.use(flash()); 

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

//log all other requests here
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'views'));
});

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);