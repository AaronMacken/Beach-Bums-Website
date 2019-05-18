// require varibles
////////////////////////////////////

const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  methodOverride = require("method-override");

// App Configure
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// mongo set up
////////////////////////////////////

// connect mongo
mongoose.connect("mongodb://localhost:27017/beachApp", {
  useNewUrlParser: true
});
// create db schema
let beachSchema = new mongoose.Schema({
  name: String,
  image: String,
  content: String
});
// create db model
let Beach = mongoose.model("Beach", beachSchema);

// Routes
////////////////////////////////////

// Landing
app.get("/", (req, res) => {
  res.render("landing");
});

// Index
app.get("/beaches", (req, res) => {
  Beach.find({}, (err, beach) => {
    if (err) console.log("Something went wrong when fetching mongo items.");
    else {
      res.render("index", { beach: beach });
    }
  });
});

// New
app.get("/beaches/new", (req, res) => {
  res.render("new");
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
  Beach.findById(req.params.id, (err, foundBlog) => {
    if(err) {
      console.log(err);
    }
    else{
      res.render("show", {blog: foundBlog});
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

// port listen
app.listen(3000, () => console.log("Server is listening."));


//initial create
// Beach.create({
//     name: "Sandy Shores",
//     image: "https://farm4.staticflickr.com/3851/14375447405_e6e792e9be.jpg",
//     content: "They serve alcohol out of a coconut. I'm for sure coming back next year without the family."
// }, (err, newBeach) => {
//     if(err) console.log("Something went wrong with initial create.");
//     else console.log("Added " + newBeach.name);
// }); 
