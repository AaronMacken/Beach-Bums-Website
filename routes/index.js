var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// Landing
router.get("/", (req, res) => {
  res.render("beaches/landing");
});

// Authenticate routes

// register form
router.get("/register", (req, res) => {
  res.render("auth/register");
});

// register post route
router.post("/register", (req, res) => {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      req.flash("error", "Something went wrong.");
      return res.redirect("/register");
    }
    req.flash("success", "Thanks for signing up! Please sign in.")
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
    failureRedirect: "/login",
    failureFlash: "Username or password incorrect.",
    successFlash:"Welcome to Beach Bums!"
  }), function(req, res){}
);

// logout route
router.get("/logout", (req, res) => {
  req.flash("success", "See you next time " + req.user.username + "!")
  req.logout();
  res.redirect("/");
});

module.exports = router;
