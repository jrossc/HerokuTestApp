// app/routes.js
module.exports = function(app, passport) {
    var Users = require('../app/models/users'); // for getting Users in the collection

    const sendError = (err, res) => {
        response.status = 501;
        response.message = typeof err == 'object' ? err.message : err;
        res.status(501).json(response);
    };

        // =====================================
        // HOME PAGE (with login links) ========
        // =====================================
        app.get('/', function(req, res) {
            res.render('index.ejs'); // load the index.ejs file
        });
    
        // =====================================
        // LOGIN ===============================
        // =====================================
        // show the login form
        app.get('/login', function(req, res) {
    
            // render the page and pass in any flash data if it exists
            res.render('login.ejs', { message: req.flash('loginMessage') }); 
        });
    
        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    
        // =====================================
        // SIGNUP ==============================
        // =====================================
        // show the signup form
        app.get('/signup', function(req, res) {
    
            // render the page and pass in any flash data if it exists
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });
    
        // process the signup form

        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));
    
        // =====================================
        // PROFILE SECTION =====================
        // =====================================
        // we will want this protected so you have to be logged in to visit
        // we will use route middleware to verify this (the isLoggedIn function)
        app.get('/profile', isLoggedIn, function(req, res) {
            res.render('profile.ejs', {
                user : req.user // get the user out of session and pass to template
            });
        });

        //get users
        app.get('/profile/users', isLoggedIn, function(req, res) {
                Users.find(function(err, users) {
                    if (err)
                        sendError(err);


                    res.json(users);
                });
        });

        //get users by id
        app.get('/profile/users/id', isLoggedIn, function(req, res) {
            Users.find({
                "name": req.query.name,
                "location": req.query.location
            }, function(err, users) {
                if (err)
                    sendError(err);
        
                res.send(users);
            });
        });

        app.post('/profile/users', isLoggedIn, function(req, res) {
            Users.create({
                name: req.body.name,
                location: req.body.location
            }, function(err, user) {
                if (err)
                    res.send(err);
        
                res.json(user);
            });
        });

        app.delete('/profile/users/:id', function(req, res) {
            Users.remove({
                _id: req.params.id
            }, function(err, user) {
                if (err)
                    res.send(err);
        
                res.json({
                    "status": "deleted"
                });
            });
        });

    
        // =====================================
        // LOGOUT ==============================
        // =====================================
        app.get('/logout', function(req, res) {
            req.logout();
            res.redirect('/');
        });
    };
    
    // route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {
    
        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated())
            return next();
    
        // if they aren't redirect them to the home page
        res.redirect('/');
    }