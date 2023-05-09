var express = require('express');
var router = express.Router();
var passport = require('passport');
// var fileUpload = require('express-fileupload');
var multer = require('multer');
var upload = multer({dest: './public/images/shoe_images'})

var shoe_controller = require('../controllers/shoeController');


// router.get('/', passport.authenticate('session', {
//   failureRedirect: '/' // If the user is not logged in, redirect them to the landing page
// }), function(req, res, next) {
//   res.render('home', {username: req.user.username });
// });

// router.get('/', passport.authenticate('session', {
//   failureRedirect: '/' // If the user is not logged in, redirect them to the landing page
// }), shoe_controller.shoe_list);

router.get('/', function(req, res, next) {
  if (!req.user) { return res.redirect('/'); } // If the user is not logged in, then redirect them to the landing page!
  next();
}, shoe_controller.shoe_list); // If the user is logged in, then display the shoe list


// router.get('/', shoe_controller.shoe_list);

// GET request for creating Shoe
router.get("/shoe/create", shoe_controller.shoe_create_get);

// POST request for creating Shoe.
router.post("/shoe/create", upload.single('image'), shoe_controller.shoe_create_post);

module.exports = router;