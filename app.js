// require varibles
////////////////////////////////////

const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  methodOverride = require("method-override"),
  Beach = require("./models/beach"),
  Comment = require("./models/comment"),
  seedDB = require("./seeds");


// App Configure
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// connect mongo
mongoose.connect("mongodb://localhost:27017/beachApp", {
  useNewUrlParser: true
});

// Seed DB - Run this once then comment out to prevent null data errors.
// seedDB();

// Routes
////////////////////////////////////

// Landing
app.get("/", (req, res) => {
  res.render("beaches/landing");
});

// Index
app.get("/beaches", (req, res) => {
  Beach.find({}, (err, beach) => {
    if (err) console.log("Something went wrong when fetching mongo items.");
    else {
      res.render("beaches/index", { beach: beach });
    }
  });
});

// New
app.get("/beaches/new", (req, res) => {
  res.render("beaches/new");
});

// Create
app.post("/beaches", (req, res) => {
  Beach.create(req.body.blog, (err, newBeach) => {
    if (err) console.log("Something went wrong when posting");
    else {
      console.log("Added: " + newBeach.name);
      res.redirect("/beaches")
    }
  });
});

// Show
app.get("/beaches/:id", (req, res) => {
  Beach.findById(req.params.id).populate("comments").exec((err, foundBlog) => {
    if(err) {
      console.log(err);
    }
    else{
      console.log(foundBlog)
      res.render("beaches/show", {blog: foundBlog});
    }
  });
});

// Edit
app.get("/beaches/:id/edit", (req, res) => {
  Beach.findById(req.params.id, (err, updateBlog) => {
    if(err){
      res.redirect("/beaches");
    }else{
      res.render("edit", {blog: updateBlog});
    }
  });
})

// Update
app.put("/beaches/:id", (req, res) => {
  Beach.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
    if(err){
      res.redirect("/beaches");
    }else{
      res.redirect("/beaches/" + req.params.id);
    }
  });
});

// Destroy
app.delete("/beaches/:id", (req, res) => {
  Beach.findByIdAndRemove(req.params.id, (err) => {
    if(err){
      res.redirect("/beaches");
    }else{
      res.redirect("/beaches");
    }
  });
});

// Nested Routes - Comments
// New comment form
app.get("/beaches/:id/comments/new", (req, res) => {
  Beach.findById(req.params.id, (err, beach) => {
    if(err) console.log(err)
    else{
      res.render("comments/new", {beach: beach});
    }
  });
});
// New comment post
app.post("/beaches/:id/comments", (req, res) => {
  Beach.findById(req.params.id, (err, beach) => {
    if(err) console.log(err)
    else{
      Comment.create(req.body.comment, (err, comment) => {
        if(err) console.log(err)
        else{
          beach.comments.push(comment);
          beach.save();
          res.redirect('/beaches/' + beach._id);
        }
      });
    }
  });
});

// port listen
app.listen(3000, () => console.log("Server is listening."));


