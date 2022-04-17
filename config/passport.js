const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const User = require("../models/UserSchema");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        // passwordField: 'passwd'
      },
      function (email, password, done) {
        User.findOne({ email: email })
          .then(async (user) => {
              console.log(user);
            if (user) {
              if (await bcrypt.compare(password, user.password)) {
                console.log(password, "=", user.password);
                // res.redirect("/dashboard");
                return done(null, user); //jika password benar
              } else {
                return done(null, false, { message: "Password Anda Salah" });
                // errors.push({ msg: "Password Salah" });
                // console.log("Password Salah");
                // res.render("login", { errors });
              }
            } //jika email belum terdaftar
            else {
              // error jika email ga ada
              return done(null, false, { message: "Email Anda Salah" });
              //   errors.push({ msg: "Email Salah" });
              //   console.log("Email Salah");
              //   res.render("login", errors);
            }
          })
          .catch((err) => {
            // errors.push({ msg: "Internal Server Error" });
            console.log("Internal Server Error" + err.message);
            // res.render("login", { errors });
          });
      }
    )
  );
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
