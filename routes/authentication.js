var express = require('express');
var passport = require('passport');
var user = require('../models/user.js');
var router = express.Router();

router.get("/", function(req, res){
  res.render("landing");
});
//==================
//adding auth routes

router.get('/signup', function(req, res, next) {
  res.render('signup');
})


// route handler for POST request to the '/signup' endpoint
router.post('/signup', function(req, res, next) {

  // Retrieve the username and password from the request body and place them into a newUser object
  var username = req.body.username;
  var password = req.body.password;
  var newUser = {username: username, password: req.body.password};

  // Register the user
  user.register(newUser, password, function(err, newUser) {
    // callback function checks if there is an error from the registration process. If so the error
    // is logged and the user is returned to the '/signup' page
    if (err) {
      console.log(err);
      return res.redirect('/signup');
    }

    // if registration is succesful, the newly registered user is authenticated
    passport.authenticate('local')(req, res, function() {
      // if authentication is succesful, redirect the user to the '/home' page
      console.log(newUser);
      res.redirect('/home');
    });

  });
});

router.get('/login', function(req, res, next) {
  res.render('login', { user: req.user})
});


router.post('/login', function(req, res, next) {
  // console.log(res);
  passport.authenticate('local', function(err, user, info) {
    console.log(user);
    if (err) { return next(err); }
    if (!user) { return res.redirect('/'); }

    req.login(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/home'); // On succesful login attempt, redirect user to the home page
      // return res.render('home',{username: req.user.username} );
    });
  })(req, res, next);
});

//==============
//adding logout route
router.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports = router;