// server.js

    // set up ========================
    const express  = require('express');
    const app      = express();                               // create our app w/ express
    const mongoose = require('mongoose');                     // mongoose for mongodb
    const morgan = require('morgan');             // log requests to the console (express4)
    const bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    const methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
    const http = require('http'); //server
    const path = require('path'); //join method

    // API file for interacting with MongoDB
    const api = require('./routes/api'); // folder where routes file are stored

    // configuration =================
    app.use(express.static(path.join(__dirname, 'public')));                 // set the static files location /public/img will be /img for users
    

    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());

    //API location, must be placed after user of bodyparser
    app.use('/api', api)                                            // outes
        
    //log all other requests here
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'public/index.html'));
    });
    
    
    // listen (start app with node server.js) ======================================
    const port = process.env.PORT || '3000';
    app.set('port', port);
    
    const server = http.createServer(app);
    server.listen(port, () => console.log(`Running on localhost:${port}`));