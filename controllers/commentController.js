var express = require('express');
var router = express.Router();
var passport = require('passport');
// var fileUpload = require('express-fileupload');
var multer = require('multer');

const { body, validationResult } = require("express-validator");
const asyncHandler = require('express-async-handler');

const Shoe = require('../models/shoe');

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

    const shoe = Shoe.findById(req.params.id);
    const comment = req.body.comment;

    console.log(req.body);

    // console.log("hi!" + shoe);
    console.log("comment:  " + comment);
    // console.log(req.user);

    res.redirect('/catalog');
  }),
];

