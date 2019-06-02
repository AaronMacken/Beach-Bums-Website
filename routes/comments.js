var express = require("express");
var router = express.Router({mergeParams: true});
var Beach = require("../models/beach"),
    Comment = require("../models/comment");


// New comment form
router.get("/new", isLoggedIn, (req, res) => {
  Beach.findById(req.params.id, (err, beach) => {
    if (err) console.log(err);
    else {
      res.render("comments/new", { beach: beach });
    }
  });
});

// New comment post
router.post("/", isLoggedIn, (req, res) => {
  Beach.findById(req.params.id, (err, beach) => {
    if (err) console.log(err);
    else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) console.log(err);
        else {
          // Add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // Save comment
          comment.save();

          beach.comments.push(comment);
          beach.save();
          res.redirect("/beaches/" + beach._id);
        }
      });
    }
  });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  }

module.exports = router;
