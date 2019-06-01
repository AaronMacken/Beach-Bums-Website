var express = require("express");
var router = express.Router();

var Beach = require("../models/beach");

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
router.get("/new", isLoggedIn, (req, res) => {
  res.render("beaches/new");
});

// Create
router.post("/", isLoggedIn, (req, res) => {
  Beach.create(req.body.beach, (err, newBeach) => {
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
router.get("/:id/edit", isLoggedIn, (req, res) => {
  Beach.findById(req.params.id, (err, updateBeach) => {
    if (err) {
      res.redirect("/beaches");
    } else {
      res.render("beaches/edit", { beach: updateBeach });
    }
  });
});

// Update
router.put("/:id", isLoggedIn, (req, res) => {
  Beach.findByIdAndUpdate(
    req.params.id,
    req.body.beach,
    (err, updatedBeach) => {
      if (err) {
        res.redirect("/beaches");
      } else {
        res.redirect("/beaches/" + req.params.id);
      }
    }
  );
});

// Destroy
router.delete("/:id", isLoggedIn, (req, res) => {
  Beach.findByIdAndRemove(req.params.id, err => {
    if (err) {
      res.redirect("/beaches");
    } else {
      res.redirect("/beaches");
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
