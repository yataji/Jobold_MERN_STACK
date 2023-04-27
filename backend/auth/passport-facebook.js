const passport = require("passport");
const User = require("../models/user");
const FacebookStrategy = require("passport-facebook").Strategy;
require("dotenv").config();

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:5000/user/facebook/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile);
    }
  )
);
