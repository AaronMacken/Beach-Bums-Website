var Beach = require("../models/beach");
var Comment = require("../models/comment");

// all the middleare goes here
var middlewareObject = {};

middlewareObject.checkBeachOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Beach.findById(req.params.id, (err, foundBeach) => {
      if (err) {
        res.redirect("back");
      } else {
        if (foundBeach.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
};

middlewareObject.checkCommentOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        res.redirect("back");
      } else {
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
};

middlewareObject.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

module.exports = middlewareObject;
