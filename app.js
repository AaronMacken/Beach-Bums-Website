// Require Vars

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
  seedDB = require("./seeds"),
  flash = require("connect-flash"),
  session = require("express-session"),
  MongoStore = require("connect-mongo")(session);

  // Requiring Routes
  const commentRoutes = require("./routes/comments"),
        beachesRoutes  = require("./routes/beaches"),
        indexRoutes = require("./routes/index");
        
// Connect & Configure Mongo
var myUrl = (process.env.DATABASEURL || "mongodb://localhost:27017/beachApp");
mongoose.connect("mongodb+srv://aaron:smurf123@cluster0-avxko.mongodb.net/test?retryWrites=true&w=majority",{
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(() => {
  console.log("Connected to DB");
}).catch(err => {
  console.log("Error", err.message);
});

// App Configure
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(flash());

// Express-session Configure & Unleak memory
app.use(session({
    secret: "This is a secret",
    resave: false,
    saveUninitialized: true
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
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Seed DB - Run this once then comment out to prevent null data errors.
// seedDB();

// Use Routes
app.use(indexRoutes);
app.use("/beaches",beachesRoutes);
app.use("/beaches/:id/comments", commentRoutes);

// port listen
app.listen(process.env.port || 3000, process.env.IP, () => console.log("Server is listening."));
