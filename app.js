// require varibles
////////////////////////////////////

const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  request = require("request"),
  mongoose = require("mongoose");

// set view engine
app.set("view engine", "ejs");
// use public directory
app.use(express.static("public"));
// use body parser
app.use(bodyParser.urlencoded({ extended: true }));

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
  comments: String
});
// create db model
let Beach = mongoose.model("Beach", beachSchema);

// routes
////////////////////////////////////

// landing
app.get("/", (req, res) => {
  res.render("landing");
});

// index
app.get("/beaches", (req, res) => {
  Beach.find({}, (err, beach) => {
    if (err) console.log("Something went wrong when fetching mongo items.");
    else {
      res.render("index", { beach: beach });
    }
  });
});

// new
app.get("/beaches/new", (req, res) => {
  res.render("new");
});

// create
app.post("/beaches", (req, res) => {
  let name = req.body.name,
    image = req.body.image,
    comments = req.body.comment;
  let beach = { name: name, image: image, comments: comments };

  Beach.create(beach, (err, newBeach) => {
    if (err) console.log("Something went wrong when posting");
    else {
      console.log("Added: " + newBeach.name);
      res.redirect("/beaches")
    }
  });
});


// show
app.get("/beaches/:id", (req, res) => {
  Beach.findById(req.params.id, (err, foundBeach) => {
    if(err) {
      console.log(err);
    }
    else{
      res.render("show", {beach: foundBeach});
    }
  });
});

//initial create
// Beach.create({
//     name: "Sandy Shores",
//     image: "https://farm4.staticflickr.com/3851/14375447405_e6e792e9be.jpg",
//     comments: "They serve alcohol out of a coconut. I'm for sure coming back next year without the family."
// }, (err, newBeach) => {
//     if(err) console.log("Something went wrong with initial create.");
//     else console.log("Added " + newBeach.name);
// }); 
// remove (for convenience)
// Beach.remove({name: "Sandy Shores"}, (err, remBeach) => {
//     if(err) console.log("Something went wrong when removing the item.")
//     else{
//         console.log("Removed item");
//     }
// });

// port listen
app.listen(3000, () => console.log("Server is listening."));
