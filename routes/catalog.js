var express = require('express');
var router = express.Router();
var passport = require('passport');
// var fileUpload = require('express-fileupload');
var multer = require('multer');

const { body, validationResult } = require("express-validator");
const asyncHandler = require('express-async-handler');

// var upload = multer({
//   dest: './public/images/shoe_images',
//   filename: function (req, file, cb) {
//     console.log('original filename on disk: ' + req.file.originalname);
//     cb(null, file.originalname);
//   }
// });

const storage = multer.diskStorage({
  destination: './public/images/shoe_images',
  filename: function (req, file, cb) {
    console.log('original filename on disk: ' + file.originalname);
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage});


var shoe_controller = require('../controllers/shoeController');
var comment_controller = require('../controllers/commentController');


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


// POST request for a Shoe. When you want to add a comment for a Shoe.
router.post("/shoe/:id", shoe_controller.shoe_details_post);

// GET request for one Shoe. The page where you can view all the comments for a given Shoe.
router.get("/shoe/:id", shoe_controller.shoe_details_get);

// router.get("/shoe/:id", comment_controller.shoe_details_get);

// router.post("/shoe/:id", comment_controller.shoe_details_post);


module.exports = router;