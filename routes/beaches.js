var express = require("express");
var router = express.Router();
var Beach = require("../models/beach");
var middleware = require("../middleware");

// Index
router.get("/", (req, res) => {
  Beach.find({}, (err, beach) => {
    if (err) console.log("Something went wrong when fetching mongo items.");
    else {
      res.render("beaches/index", { beach: beach });
    }
  });
});

// New
router.get("/new", middleware.isLoggedIn, (req, res) => {
  res.render("beaches/new");
});

// Create
router.post("/", middleware.isLoggedIn, (req, res) => {
  var author = { id: req.user._id, username: req.user.username };
  var beach = {
    name: req.body.beach.name,
    image: req.body.beach.image,
    content: req.body.beach.content,
    author: author
  };
  Beach.create(beach, (err, newBeach) => {
    if (err) console.log("Something went wrong when posting");
    else {
      console.log("Added: " + newBeach.name);
      res.redirect("/beaches");
    }
  });
});

// Show
router.get("/:id", (req, res) => {
  Beach.findById(req.params.id)
    .populate("comments")
    .exec((err, foundBeach) => {
      if (err) {
        console.log(err);
      } else {
        res.render("beaches/show", { beach: foundBeach });
      }
    });
});

// Edit
router.get("/:id/edit", middleware.checkBeachOwnership, (req, res) => {
  Beach.findById(req.params.id, (err, foundBeach) => {
    res.render("beaches/edit", {beach: foundBeach});
  });
});

// Update
router.put("/:id", middleware.checkBeachOwnership, (req, res) => {
  Beach.findByIdAndUpdate(
    req.params.id, req.body.beach, (err, updatedBeach) => {
        res.redirect("/beaches/" + req.params.id);
    }
  );
});

// Destroy
router.delete("/:id", middleware.checkBeachOwnership, (req, res) => {
  Beach.findByIdAndRemove(req.params.id, err => {
      res.redirect("/beaches");
  });
});

module.exports = router;
