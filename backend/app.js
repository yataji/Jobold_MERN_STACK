const session = require("express-session");
// const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const mongodbsession = require("connect-mongodb-session")(session);
const passport = require("passport");
const app = express();
require("dotenv").config();
const userRoutes = require("./routes/user");
const { isAuthentificated } = require("./midlleware/auth");
require("./auth/passport-google");
require("./auth/passport-facebook");
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    socketTimeoutMS: 0,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((e) => console.log(e));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const store = new mongodbsession({
  uri: process.env.MONGODB_URI,
  collection: "mySessions",
});
app.use(
  session({
    name: "jobold",
    secret: process.env.SESSION_SECRET,
    resave: false, //means ,for every request on the server create a new session
    saveUninitialized: false, // save and initialize the session even if we don't manipulate it
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // one day
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.get("/", (req, res) => {
  res.send("JOBOLD");
});
//authentification with google
app.get(
  //specify the authentification with the passport authentification method
  "/user/auth/google",
  //google means that the authentification willl be with google
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  //this route is already specfied in the google strategy in passport-google.js
  "/user/google/callback",
  passport.authenticate("google", {
    successRedirect: "/user/dashboard",
    failureRedirect: "/",
  })
);
//if the call of the oauth has been failed
app.get("/user/login", (req, res) => {
  res.send("login");
});

// if everything okay
app.get("/user/dashboard", isAuthentificated, (req, res) => {
  res.status(200).json({
    message: "y're logged in dashbord",
  });
});

//configuration of the facebook auth
app.get("/user/auth/facebook", passport.authenticate("facebook"));
//then we will configure the facebook strategy callback
app.get(
  "/user/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/user/dashboard",
    failureRedirect: "/user/login",
  })
);
app.use("/user", userRoutes);

module.exports = app;
