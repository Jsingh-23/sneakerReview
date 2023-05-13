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

router.post('/signup', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  var newUser = {username: username, password: req.body.password};

  user.register(newUser, password, function(err, newUser) {
    if (err) {
      console.log(err);
      return res.redirect('/signup');
    }

    passport.authenticate('local')(req, res, function() {
      console.log(newUser);
      res.redirect('/home');
    });

  });
});

router.get('/login', function(req, res, next) {
  res.render('login', { user: req.user})
});

// router.post('/login', passport.authenticate('local'), function(req, res, next) {
//   res.redirect('/home');
// });

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

// router.post('/login/password', passport.authenticate("local",
//         {
//             successRedirect:"/home",
//             failureRedirect: "/"
//         }), function(req, res){
// });



//==============
//adding logout route
router.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});



module.exports = router;