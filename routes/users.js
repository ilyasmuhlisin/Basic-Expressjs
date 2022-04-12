var express = require('express');
var router = express.Router();


// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// login
router.get('/login', function(req, res, next) {
  res.render("login", { title: "Halaman login" });
});

router.get("/register", function (req, res, next) {
  res.render("register", { title: "Halaman register" });
});

module.exports = router;
