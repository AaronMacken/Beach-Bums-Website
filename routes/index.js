var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// Landing
router.get("/", (req, res) => {
  res.render("beaches/landing");
});

// Auth routes

// register form
router.get("/register", (req, res) => {
  res.render("auth/register");
});

// register post route
router.post("/register", (req, res) => {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.redirect("/register");
    }
    res.redirect("/login");
  });
});

// login routes

// login form
router.get("/login", (req, res) => {
  res.render("auth/login");
});

// login post route
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
  })
);

// logout route
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// Middleware for user capabilities
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
