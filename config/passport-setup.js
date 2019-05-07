const passport = require('passport')
const GoogleStartegy = require ('passport-google-oauth20')
const User = require('../models').User
const passportJWT = require("passport-jwt");


passport.use(new GoogleStartegy({
  callbackURL:"http://localhost:3000/auth/google/callback",
  clientID:'18198847697-s4l0glost4po58edqbdf0nhoev3t6lr9.apps.googleusercontent.com',
  clientSecret:"3qInDFBbS5JKFUKsrt2k7cGH"
},
(accessToken, refreshToken, profile, done)=>{
  const name = profile.displayName;
  console.log(profile)
  return done(null, profile);
}))


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
