var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// import userSchema
const User = require("../models/UserSchema");

// get login
router.get("/login", function (req, res, next) {
  res.render("login", { title: "Halaman login" });
});

// post login
router.post("/login", function (req, res, next) {
  const { email, password } = req.body;
  console.log(req.body);

  //data error
  let errors = [];
  if (!email || !password) {
    errors.push({ msg: "Silahkan lengkapi data anda" });
    console.log("Silahkan lengkapi data anda");
  }
  // jika error akan reload halaman ulang
  if (errors.length > 0) {
    res.render("login", {
      errors,
      email,
      password,
    });
  } else {
    // cek email sudah terdaftar
    //perintah bcryopt compaire jadi menggukana async
    User.findOne({ email: email })
      .then(async (user) => {
        if (user) {
          if (await bcrypt.compare(password, user.password)) {
            console.log(user);
            console.log("cek" + password, "||", user.password);
            res.redirect("/dashboard");
          } else {
            errors.push({ msg: "Password Salah" });
            console.log("Password Salah");
            res.render("login", { errors });
          }
        } //jika email belum terdaftar
        else {
          // error jika email ga ada
          errors.push({ msg: "Email Salah" });
          console.log("Email Salah");
          res.render("login", errors);
        }
      })
      .catch((err) => {
        errors.push({ msg: "Internal Server Error" });
        console.log("Internal Server Error" + err.message);
        res.render("login", { errors });
      });
  }
});

// get register
router.get("/register", function (req, res, next) {
  res.render("register", { title: "Halaman register" });
});
// post register
router.post("/register", function (req, res, next) {
  const { name, email, password, password2 } = req.body;
  console.log(req.body);

  //data error
  let errors = [];
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Silahkan lengkapi data anda" });
    console.log("Silahkan lengkapi data anda");
  }
  if (password != password2) {
    errors.push({ msg: "Password anda tidak sama" });
    console.log("Password anda tidak sama");
  }
  // jika error akan reload halaman ulang
  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    // cek email sudah terdaftar
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "Email sudah terdaftar" });
        console.log("Email sudah terdaftar");
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
        });
      } //jika email belum terdaftar
      else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        });
        newUser
          .save()
          .then((user) => {
            console.log(user);
            console.log("selamat anda berhasil registrasi,silahkan login");
            res.redirect("/auth/login");
          })
          .catch((err) => console.log(err));
      }
    });
  }
});
// logout
router.get("/logout", function (req, res) {
  res.redirect("/");
});

module.exports = router;
