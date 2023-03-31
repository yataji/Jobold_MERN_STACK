const express = require("express");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");

require("./auth");

mongoose
  .connect("mongodb://0.0.0.0:27017/testdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    socketTimeoutMS: 0,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((e) => console.log(e));

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

const app = express();
app.use(
  session({
    name: "codeil",
    secret: "something",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.get("/", (req, res) => {
  res.send('<a href="/auth/google">Aythentification  with google </a> ');
});
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/protected",
    failureRedirect: "/auth/failure",
  })
);

app.get("/auth/failure", (req, res) => {
  res.send("something wrong");
});

app.get("/protected", isLoggedIn, (req, res) => {
  res.send(`Hello ${req.user.displayName}<br> <a href="/logout">Logout </a>`);
});

app.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy();
    res.redirect("/");
  });
});

app.listen(5000, () => console.log("Listening in 5000"));
