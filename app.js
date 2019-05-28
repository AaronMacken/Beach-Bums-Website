// require varibles
////////////////////////////////////

const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  methodOverride = require("method-override"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  passportLocalMongoose = require("passport-local-mongoose"),
  Beach = require("./models/beach"),
  Comment = require("./models/comment"),
  User = require("./models/user"),
  seedDB = require("./seeds");

// Connect & Configure Mongo
mongoose.connect("mongodb://localhost:27017/beachApp", {
  useNewUrlParser: true,
  useFindAndModify: false
});

// App Configure
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Express-session Configure
app.use(
  require("express-session")({
    secret: "This is a secret",
    resave: false,
    saveUninitialized: false
  })
);

// Passport Configure
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Pass req.user (the logged in user) to each template
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
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
app.get("/beaches/new", isLoggedIn, (req, res) => {
  res.render("beaches/new");
});

// Create
app.post("/beaches", isLoggedIn, (req, res) => {
  Beach.create(req.body.beach, (err, newBeach) => {
    if (err) console.log("Something went wrong when posting");
    else {
      console.log("Added: " + newBeach.name);
      res.redirect("/beaches");
    }
  });
});

// Show
app.get("/beaches/:id", (req, res) => {
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
app.get("/beaches/:id/edit", isLoggedIn, (req, res) => {
  Beach.findById(req.params.id, (err, updateBeach) => {
    if (err) {
      res.redirect("/beaches");
    } else {
      res.render("beaches/edit", { beach: updateBeach });
    }
  });
});

// Update
app.put("/beaches/:id", isLoggedIn, (req, res) => {
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
app.delete("/beaches/:id", isLoggedIn, (req, res) => {
  Beach.findByIdAndRemove(req.params.id, err => {
    if (err) {
      res.redirect("/beaches");
    } else {
      res.redirect("/beaches");
    }
  });
});

// Nested Routes - Comments
// New comment form
app.get("/beaches/:id/comments/new", isLoggedIn, (req, res) => {
  Beach.findById(req.params.id, (err, beach) => {
    if (err) console.log(err);
    else {
      res.render("comments/new", { beach: beach });
    }
  });
});
// New comment post
app.post("/beaches/:id/comments", isLoggedIn, (req, res) => {
  Beach.findById(req.params.id, (err, beach) => {
    if (err) console.log(err);
    else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) console.log(err);
        else {
          beach.comments.push(comment);
          beach.save();
          res.redirect("/beaches/" + beach._id);
        }
      });
    }
  });
});

// Auth routes

// register form
app.get("/register", (req, res) => {
  res.render("auth/register");
});

// register post route
app.post("/register", (req, res) => {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.redirect("/register");
    }
    res.redirect("/login");
  });
});

// login routes

// login form
app.get("/login", (req, res) => {
  res.render("auth/login");
});

// login post route
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
  })
);

// logout route
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// port listen
app.listen(3000, () => console.log("Server is listening."));

// Middleware for user capabilities
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
