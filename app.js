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
var LocalStrategy = require('passport-local');
var bodyParser = require('body-parser');

var compression = require("compression");
var RateLimit = require("express-rate-limit");

// var SQLiteStore = require('connect-sqlite3')(session);

var landingRouter = require('./routes/landing');
// var authRouter = require('./routes/auth');
var usersRouter = require('./routes/users');
var indexRouter = require('./routes/index');
var catalogRouter = require('./routes/catalog');
var aboutRouter = require('./routes/about');
var authenticationRouter = require('./routes/authentication');

var app = express();

app.use(compression());

// Set up rate limiter: maximum of twenty requests per minute
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});
// Apply rate limiter to all requests
app.use(limiter);

app.use(require("express-session")({
  secret: "secret",
  resave: false,
  saveUninitialized: false
}));

app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

var User = require('./models/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set up mongoose connection
mongoose.set('strictQuery', false);
const dev_db_url = 'mongodb+srv://Jsingh23:Karan123@cluster0.tekbmn7.mongodb.net/game_store?retryWrites=true&w=majority';
const mongoDB = process.env.MONGODB_URI || dev_db_url;

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

app.use(passport.authenticate('session'));

app.use('/', landingRouter);
app.use('/home', indexRouter);
app.use('/', authenticationRouter);
// app.use('/', authRouter);
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

module.exports = app;