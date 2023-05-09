require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var passport = require('passport');
var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');
// var fileUpload = require('express-fileupload');
var multer = require('multer');

var SQLiteStore = require('connect-sqlite3')(session);

var landingRouter = require('./routes/landing');
var authRouter = require('./routes/auth');
var usersRouter = require('./routes/users');
var indexRouter = require('./routes/index');
var catalogRouter = require('./routes/catalog');
var aboutRouter = require('./routes/about');

var app = express();

// Set up mongoose connection
mongoose.set('strictQuery', false);
const mongoDB = 'mongodb+srv://Jsingh23:Karan123@cluster0.tekbmn7.mongodb.net/game_store?retryWrites=true&w=majority';

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app.use(fileUpload());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' })
}));

app.use(passport.authenticate('session'));

app.use('/', landingRouter);
app.use('/home', indexRouter);
app.use('/', authRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);
app.use('/about', aboutRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// const Shoe = require('./models/shoe');
// const shoeExample = new Shoe({
//   name: 'example shoe',
//   image: './public/images/shoe_images/jordan4.jpeg',
//   description: "Air Jordan 4"
// });
// shoeExample.save((err, shoe) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(shoe);
//   }
// });

module.exports = app;
