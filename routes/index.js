var express = require('express');
var router = express.Router();
var passport = require('passport');


/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('home', { username:req.user.username });
// });

// router.get('/', passport.authenticate('session', {
//   failureRedirect: '/' // If the user is not logged in, redirect them to the landing page
// }), function(req, res, next) {
//   res.render('home', {username: req.user.username });
// });

router.get('/', function(req, res, next) {
  if (!req.user) {return res.redirect('/'); } // If the user is not logged in, redirect them to the landing page!
  next();
}, function(req, res, next) {
  res.render('home', {username: req.user.username }); // If the user is logged in, then render the home page
});



module.exports = router;