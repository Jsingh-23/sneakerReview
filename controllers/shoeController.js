const { body, validationResult } = require("express-validator");
const asyncHandler = require('express-async-handler');
// const fileUpload = require('express-fileupload');
const multer = require('multer');


const Shoe = require('../models/shoe');
const Comment = require('../models/comment');

// const storage = multer.diskStorage({
//   destination: './public/images/shoe_images',
//   filename: function (req, file, cb) {
//     console.log('original filename on disk: ' + req.file.originalname);
//     cb(null, file.fieldname);
//   }
// });

// const upload = multer({ storage: storage});

exports.shoe_list = (req, res, next) => {
  Shoe.find({}, "name image")
    .sort({ name: 1})
    .populate("image")
    .exec(function (err, list_shoes) {
      if (err) {
        return next(err);
      }
      // console.log(list_shoes);
      res.render("shoe_list", {title: "Shoe List", shoe_list: list_shoes});
    });
};

// exports.shoe_create_get = (req, res, next) => {
//   res.render("shoe_form", {
//     title: "Add Shoe"
//   });
// };

// exports.shoe_create_post = (req, res, next) => {
//   res.send("Not implemented yet");
// };

// Display shoe create form on GET.
exports.shoe_create_get = asyncHandler(async (req, res, next) => {
  res.render("shoe_form", {
    title: "Add Shoe"
  });
});

// Handle shoe create on POST.
exports.shoe_create_post = [
  // Validate and sanitize name and description.
  body("name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    console.log(errors);

    // console.log("comment:  "  + req.body.comment);

    // Create a Shoe object with escaped and trimmed data.
    const shoe = new Shoe({
      name: req.body.name,
      description: req.body.description,
      image: req.file.originalname
    });

    if (!errors.isEmpty()) {

    } else {
      // Data from form is valid. Save shoe.
      await shoe.save();
      res.redirect('/catalog');
    }

  }),
];


exports.shoe_details_get = asyncHandler(async (req, res, next) => {

  const [shoe] = await Promise.all([
    Shoe.findById(req.params.id).exec(),
  ]);

  console.log(shoe);
  res.render("shoe_detail", {
    title: "Shoe Details",
    shoe: shoe,
  });
});

exports.shoe_details_post = [
  // Validate and sanitize comment field
  body("comment", "Comment must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Process request after validation and sanitization

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    console.log(errors);


    var [shoe] = await Promise.all([
      Shoe.findById(req.params.id).exec(),
    ]);

    const comment = req.body.comment;
    console.log(comment);

    console.log("req.user.username:  " + req.user.username);



    shoe.comments.push([req.user.username, comment]);
    shoe.save();

    // console.log(shoe);

    // const newComment = new Comment({
    //   text: comment,
    //   author.id: req.user._id,
    //   author.username: req.user.username,
    // });






    // const shoe = new Book({
    //   name:
    // })



    // console.log(req.body);

    // console.log("hi!" + shoe);
    // console.log("comment:  " + comment);
    // console.log("user:  " + req.user.username);
    // console.log(req.user);

    // res.redirect('/catalog');
    res.redirect(req.originalUrl);
  }),
];