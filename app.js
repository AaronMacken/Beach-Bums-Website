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
mongoose.connect("mongodb://localhost:27017/beachApp", { useNewUrlParser: true });
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

// port listen
app.listen(3000, () => console.log("Server is listening."));



