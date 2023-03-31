const passport = require("passport");
const User = require("./models/user");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const GOOGLE_CLIENT_ID =
  "848960870170-psottstu31ogs0avgcrkav9s24114mc8.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/google/callback",
      passReqToCallback: true,
    },

    function (request, accessToken, refreshToken, profile, done) {
      const defaultUser = {
        firstName: profile.name.giveName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        gooogleId: profile.id,
      };
      const user = User.findOrCreate({
        where: { gooogleId: profile.id },
        defaults: defaultUser,
      }).catch((err) => {
        console.log("Error Signing up", err);
        done(err, null);
      });
      return done(null, user);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (id, done) {
  const user = User.findOne({ where: { id } }).catch((err) => {
    console.log("Error deserializin", err);
    done(err, null);
  });
  console.log("Deserialized user");
  if (user) done(null, user);
});
