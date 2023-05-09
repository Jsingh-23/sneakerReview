const { body, validationResult } = require("express-validator");
const asyncHandler = require('express-async-handler')
// const fileUpload = require('express-fileupload');
const multer = require('multer');


const Shoe = require('../models/shoe');

const storage = multer.diskStorage({
  destination: './public/images/shoe_images',
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

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
  // Validate and sanitize fields.
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

    // app.use(fileUpload());
    // const {image} = req.files;
    // image.mv(__dirname + 'public/images/shoe_images' + image.name)

    // const storageEngine = multer.diskStorage({
    //   destination: 'public/images/shoe_images',
    //   filename: (req, file, cb) => {
    //     cb(null, `${Date.now()}--${file.originalname}`); // null as the error, and a template string as filename
    //                                                      // template string consists of timestamp using Date.now() so image names are always unique
    //   },
    // });

    // const upload = multer({
    //   storage: storageEngine,
    // });

    // Create a Shoe object with escaped and trimmed data.
    const shoe = new Shoe({
      name: req.body.name,
      description: req.body.description,
      image: req.file.path
    });

    if (!errors.isEmpty()) {

    } else {
      // Data from form is valid. Save book.
      await shoe.save();
      res.redirect('/catalog');
    }

  }),
];