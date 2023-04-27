const passport = require("passport");
const User = require("../models/user");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
require("dotenv").config();
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://localhost:5000/user/google/callback",
      passReqToCallback: true,
    },

    function (request, accessToken, refreshToken, profile, done) {
      let { email, given_name, family_name, id } = profile;
      User.find({ email })
        .then((user) => {
          if (user.length) {
            //user exist
            console.log("user exist");
          } else {
            const newUser = new User({
              firstName: given_name,
              lastName: family_name,
              email: email,
              googleId: id,
            })
              .save()
              .then(() => {
                console.log("user created successfully");
              })
              .catch((err) => {
                console.log(err);
                console.log("error while saving user");
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });

      return done(null, profile);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
