const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User= require('../models/User');
const db= require('../db/db');
const Sequelize= require('sequelize');
const gravatar= require('gravatar');

const DEBUG = 0;

const JWTstrategy = require('passport-jwt').Strategy;
//We use this to extract the JWT sent by the user
const ExtractJWT = require('passport-jwt').ExtractJwt;


/*
//passport middleware for signup
passport.use('signup', new localStrategy({
  usernameField : 'email',
  passwordField : 'password', 
  passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        var FindEmail= await User.findOne({where: { email: email }});
        
if(!FindEmail){
    const hash = await bcrypt.hash(password, 10);
  password = hash;
var user= await User.create({username: email, email: email, passwordHash: password, isAdmin: false, RoleId: 2});
return done(null, user);
}
else{
    console.log('Exista User cu acest email');
    let user;
    return done(null, false, { message: 'Email already taken.' })

}
    } catch (error) {
      console.log(error);
      done(error);
    }
}));
*/



//passport middleware for signup
passport.use('signup', new localStrategy({
  usernameField : 'email',
  passwordField : 'password', 
  passReqToCallback: true
}, async (req, email, password, done) => {
    try {
      let fullName= req.body.fullName;
      let confirm= req.body.confirmPassword;
      if(confirm == password){
      console.log('\n full Name', fullName);
      console.log('\n confirm ', confirm);
        var FindEmail= await User.findOne({where: { email: email }}); 
if(!FindEmail){
    const hash = await bcrypt.hash(password, 10);
  password = hash;
  let grav=gravatar.url(email, {s: 200, protocol: 'http'});
var user= await User.create({username: email, email: email, passwordHash: password, isAdmin: false, RoleId: 2, fullName:fullName, avatarUrl: grav});
let message= 'Signup successfull';
return done(null, user);
}
else{
    console.log('Exista User cu acest email');
   let errid=1;
  return done(null, errid)
}
      }else {
       let  errid=2;
        return done(null, errid)}
    } catch (error) {
      console.log(error);
      done(error);
    }
}));






//passport middleware for login

passport.use('login', new localStrategy({
  usernameField : 'email',
  passwordField : 'password', 
  passReqToCallback: true
}, async (req, email, password, done) => {
  try {
  
    //Find the user associated with the email provided by the user
    var FindEmail= await User.findOne({where: { email: email }});
   //console.log('\n\n CUMVA AM AJUNS IN PASSPORT LOGIN, DATELE DE PE FINDEMAIL SUNT ', FindEmail);
    let user=FindEmail;
  // console.log('\n\n DATELE  IN user din FINDEMAIL SUNT   ', user);

    if( !user ){
      //If the user isn't found in the database, return a message
      console.log('\n User not found');
      return done(null, 1);

    }
    //Validate password and make sure it matches with the corresponding hash stored in the database
    //If the passwords match, it returns a value of true.
   // console.log('\n\n Inainte de validate');
    const validate = await User.isValidPassword(password,user);

    //console.log('\n\n  DUpa validate', validate);
    if( !validate ){
      return done(null, 2);
    }
    //Send the user information to the next middleware
    return done(null, user);
  } catch (error) {
    return done(error);
  }

}));



//This verifies that the token sent by the user is valid
passport.use(new JWTstrategy({
  //secret we used to sign our JWT
  secretOrKey : 'top_secret',
  
  //extract token from header with the name secret_token
 jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken('secret_token')
 
}, async (token, done) => {
  try {
      //console.log('SUNT DIN FUNCTIA PASSPORT.USER JWT', token.user);
    //Pass the user details to the next middleware
    return done(null, token.user);
  } catch (error) {
    done(error);
  }
}));




passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});




module.exports= passport;