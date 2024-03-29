var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const passport = require("passport");
const flash = require("connect-flash")
const session = require("express-session")

// menambahkan modul layout
var expressLayout = require("express-ejs-layouts");

const database = require("./config/database");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
// menambahkan file
var moviesRouter = require("./routes/movies");

var app = express();
// configuration passport
require("./config/passport")(passport);
// express session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}))
//config passport middleware
app.use(passport.initialize());
app.use(passport.session());
// connect to flash
app.use(flash());

// view engine setup
// app.set("views", path.join(__dirname, "views"));
app.use(expressLayout);
app.set("view engine", "ejs");

// connection mDB
database.connection.on(
  "error",
  console.error.bind(console, "Mongodb Connection Error:")
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
//global variable errors on messages
app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  next()
})
app.use("/", indexRouter);
app.use("/auth", usersRouter);
// memanggil path file
app.use("/movies", moviesRouter);

// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next();
// });

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;