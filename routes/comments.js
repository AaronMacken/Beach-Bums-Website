var express = require("express");
var router = express.Router({ mergeParams: true });
var Beach = require("../models/beach"),
  Comment = require("../models/comment"),
  middleware = require("../middleware");

// New comment form
router.get("/new", middleware.isLoggedIn, (req, res) => {
  Beach.findById(req.params.id, (err, beach) => {
    if (err) {
      
    } else {
      res.render("comments/new", { beach: beach });
    }
  });
});

// New comment route
router.post("/", middleware.isLoggedIn, (req, res) => {
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

// Edit comment form
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    res.render("comments/edit", {
      beach_id: req.params.id,
      comment: foundComment
    });
  });
});

// Update comment route
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, foundComment) => {
        res.redirect("/beaches/" + req.params.id);
      }
  );
});

// Destory comment route
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, err => {
    res.redirect("/beaches/" + req.params.id);
  });
});

module.exports = router;
