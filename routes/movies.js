var express = require("express");
var router = express.Router();
var moment = require("moment");
var Movie = require("../models/MovieSchema");

const { cekAuth } = require("../config/auth");

// get All Movies
router.get("/", cekAuth, function (req, res, next) {
  let ListMovies = [];
  //memanggil data movies
  Movie.find(function (err, movies) {
    // console.log(movies)
    if (movies) {
      // karena akan mengambil setiap atriibut
      for (let data of movies) {
        ListMovies.push({
          id: data._id,
          name: data.name,
          released_on: data.released_on,
        });
      }
      // menampilkan objec list ke view all movies
      res.render("movie/allMovies", { ListMovies });
    } else {
      ListMovies.push({
        id: "",
        name: "",
        released_on: "",
      });
    }
    res.render("movie/allMovies", { ListMovies });
  });
  // res.render("movie/allMovies", { title: "Halaman Get Movies" });
});

// create movies
router.get("/create", cekAuth, function (req, res, next) {
  res.render("movie/createMovies", { title: "Halaman Create Movies" });
});

// update
router.get("/update/:movieId", cekAuth, function (req, res, next) {
  Movie.findById(req.params.movieId, function (err, movieInfo) {
    var newDate = moment(movieInfo.released_on).format("YYYY-MM-DD");
    if (movieInfo) {
      //melihat response
      console.log(movieInfo);
      res.render("movie/updateMovies", {
        movies: movieInfo,
        newDate,
      });
    }
  });
  // res.render("movie/updateMovies", {
  //   title: "Halaman Update Movies",
  //   movieId: req.params.movieId,
  // });
});

// action create
router.post("/create", cekAuth, function (req, res) {
  const { name, date } = req.body;
  console.log(req.body);
  let errors = [];
  if (!name || !date) {
    errors.push({ msg: "Silahkan Lengkapi data" });
    console.log("Silahkan Lengkapi data");
  }

  if (errors.length > 0) {
    res.render("movie/createMovies", { errors });
  } else {
    const newMovie = new Movie({
      name,
      // karena yang akan ditampilkan berbeda maka memanggila spesifik
      released_on: date,
    });
    newMovie
      .save()
      .then((movie) => {
        console.log(movie);
        errors.push({ msg: "Data Movies Berhasil ditambahkan" });
        res.render("movie/createMovies", { errors });
      })
      .catch((err) => console.log(err));
  }
  // console.log(req.body);
});

// action update
// router.put("/update/:movieId", function (req, res) {});
router.post("/update", cekAuth, function (req, res) {
  let errors = [];
  Movie.findByIdAndUpdate(
    req.body.id,
    {
      name: req.body.name,
      released_on: req.body.date,
    },
    function (err) {
      if (err) {
        console.log(err);
      } else {
        errors.push({ msg: "Data berhasil terupdate" });
        var newMovies = { _id: req.body.id, name: req.body.name };
        var newDate = moment(req.body.date).format("YYYY-MM-DD");
        res.render("movie/updateMovies", {
          movies: newMovies,
          newDate,
          errors,
        });
      }
    }
  );
});

// action delete
// router.delete("/delete/:movieId", function (req, res) {});
router.get("/delete/:movieId", cekAuth, function (req, res) {
  Movie.findByIdAndDelete(req.params.movieId, function () {
    res.redirect("/movies");
  });
  // console.log(req.params.movieId)
});

module.exports = router;
