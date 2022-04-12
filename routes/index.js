var express = require("express");
var router = express.Router();

// halaman welcome
router.get("/", function (req, res, next) {
  res.render("welcome", { title: "Halaman Welcome" });
});

// halaman dashboard
router.get("/dashboard", function (req, res, next) {
  res.render("dashboard", { title: "Halaman Dashboard" });
});

module.exports = router;
