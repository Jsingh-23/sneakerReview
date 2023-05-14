const { body, validationResult } = require("express-validator");
const asyncHandler = require('express-async-handler');
const multer = require('multer');


const Shoe = require('../models/shoe');
const Comment = require('../models/comment');

exports.shoe_list = (req, res, next) => {
  Shoe.find({}, "name image")
    .sort({ name: 1})
    .populate("image")
    .exec(function (err, list_shoes) {
      if (err) {
        return next(err);
      }
      res.render("shoe_list", {title: "Shoe List", shoe_list: list_shoes});
    });
};

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
    shoe.comments.push([req.user.username, comment]);
    shoe.save();
    res.redirect(req.originalUrl);
  }),
];