/*  EXPRESS */

const express = require('express');
const app = express();
const session = require('express-session');

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

app.set('view engine', 'ejs');

var userProfile;
var token;

app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'SECRET' 
}));

app.get('/', function(req, res) {
  res.render('pages/auth', {message: 'Autenticación Google'});
});
app.get('/error', function(req, res) {
  res.render('pages/auth', {message: 'Correo no institucional'});
});
app.get('/succ', function(req, res) {
  res.render('pages/success', {user: userProfile});
});

const port = process.env.PORT || 3000;
app.listen(port , () => console.log('App listening on port ' + port));

/*  PASSPORT SETUP - CONNECTION */

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


passport.use(new GoogleStrategy({
    clientID: '842689314662-npi7t9jh71731olt1k04nm2fqaurof20.apps.googleusercontent.com',
    clientSecret: '2zGlUE6ctTpWCxd-MQFZckhN',
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      token = accessToken;
      console.log(userProfile);
      console.log(accessToken);
      
      if(userProfile._json.hd != "unsaac.edu.pe") {
        console.log("Correo no institucional");
        return done(false, null, {message : 'Cannot log in'})
      } else {
        return done(null, userProfile);
      }
      //return done(null, userProfile);
  }
));

/* AUTHENTICATION - CALLBACK */

app.get('/auth/google', 
  passport.authenticate('google', { scope : ['https://www.googleapis.com/auth/userinfo.email'] }));
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error', successRedirect: '/succ'}  )

  /*,
  function(req, res) {

    // Successful authentication, redirect success.
    res.redirect('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + token);
  }*/
  );

app.get('/auth/refreshTokenGoogle', 
  passport.authenticate('google', { scope : ['https://www.googleapis.com/auth/userinfo.email'] }));