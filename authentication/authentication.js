const passport=require("passport")
var localStrategy=require("passport-local").Strategy
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const modelUser=require("../models/user")
const modelRole=require("../models/role")
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJWT=require("passport-jwt").ExtractJwt

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.use('signup',new localStrategy({

    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },async function(req, email, password, done) {
        var email=req.body.email
        var password1=req.body.password
        var confPassword1=req.body.confimPassword
        var username=req.body.username
    
    
        if(!email || !username || !password1 || !confPassword1)
          return done(null,false,{message: "All the field must be filled"})
        else{
          if(password!==confPassword1){
         return done(null,false,{message: "Password must be the same"})}
       
          else{
            var users=await modelUser.findOne({where: {'email': req.body.email}})
                if(users!==null)
                  done(null,false,{message: "User is already in database"})
                else{
                   var user= modelUser.create({'name':req.body.username, 'email': req.body.email ,'passwordHash':req.body.password,'roleId': 2})
                      if(user)
                        return done(null,user.email,{message: "User created successfully"}) 
                      else
                        return done(null,user.email,{message: "Error somewere"})
                      
                    } 
                }
              } 
            }
  ) )             
  
  
    passport.use('signin',new localStrategy({
       
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },async function(req,username,password,done){
      
      var users=await modelUser.findOne({where:{'email': req.body.email}})
          if(users===null)
              done(null,false,{message: "User was not found"})
          else{
              bcrypt.compare(req.body.password,users.passwordHash,(err,match)=>{
              if(match){
                var pay=users.toJSON()
                var user_payload={
                username: pay.name,
                email: pay.email,
                role: pay.roleId
                        }
                var token=jwt.sign(user_payload,"Mysecretcode",{algorithm: 'HS256',expiresIn: '2h'})
                jwt.verify(token,"Mysecretcode",(err,good)=>{
                               if(good && !err){ 
                                var info= {
                                    status:"Login successfully",
                                    token: token,
                                    role: pay.roleId 
                                }
                                return done(null,users,info)}
                               else
                                return done(null,false,{message: "Authentication has expired"})
                          })
                        }
                        else
                         return done(null,false,{message:"Password does not match"})

                      })   
                    }
            }))
            
     /* Middleware for passport-jwt for secure routes */      

   passport.use("jwt",new JwtStrategy({
     
      jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken("JWT"),
      secretOrKey : "Mysecretcode" },
      async (jwt_payload,done)=>{
            
      var users=await modelUser.findOne({where:{email: jwt_payload.email}})
         if(users){
           var info_token={
              name: users.name,
              email: users.email,
              role: users.roleId
                  }
           done(null,info_token)}
          else
            done(null,false,{message: "Authentication has expired"})                        
        }
      )
     )
  