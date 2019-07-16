const passport=require("passport")
var localStrategy=require("passport-local").Strategy
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const modelUser=require("./../models/user")
const modelRole=require("./../models/role")
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJWT=require("passport-jwt").ExtractJwt

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });



passport.use('signup',new localStrategy({

    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},function(req, email, password, done) {
    var username=req.body.email
    var password1=req.body.password
    var confPassword1=req.body.confPassword
    
    
    if(!username || !password || !confPassword1){
      return done(null,false,{message: "All the field must be filled"})
    }
    else
     {if(password!==confPassword1){
         return done(null,false,{message: "Password must be the same"})
     }
       
     else{
        console.log(modelUser)
        modelUser.findOne({where: {'email': req.body.email}})
                      .then((users)=>{
                            console.log(users)
                            if(users!==null)
                                {console.log("User is in database")
                                done(null,false,{message: "User is already in database"})
                                 }
                            else
                            {
                                console.log(username,password1,confPassword1,"Aici esti")
                                modelUser.create({'name':req.body.username, 'email': req.body.email ,'passwordHash':req.body.password})
                                    .then((user)=>{return done(null,user.email,{message: "User created successfully"})})
                                    .catch((error) => {return done(error,false,{message: "Error somewere"})})
                            }
                                }) 
     }}
    })  )           
 
    
    passport.use('signin',new localStrategy({
       
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },function(req,username,password,done){
      
        modelUser.findOne({where:{'email': req.body.email}})
            .then((users)=>{ //console.log(users)
                if(users===null)
                  done(null,false,{message: "User was not found"})
                else
                  {
                    bcrypt.compare(req.body.password,users.passwordHash,(err,match)=>{
                      
                          if(match){ 
                          var pay=users.toJSON()
                          var user_payload={
                            username: pay.name,
                            email: pay.email
                          }
                          var token=jwt.sign(user_payload,"Mysecretcode",{algorithm: 'HS256',expiresIn: '2h'})
                          jwt.verify(token,"Mysecretcode",(err,good)=>{
                               if(good && !err){ 
                                var info= {
                                    status:"Login successfully ",
                                    token: token 
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
                  })
                .catch((error) => {return done(error,false,{message: "Error somewere"})})
            }))
            
     /* Middleware for passport-jwt for secure routes */      

   passport.use("jwt",new JwtStrategy({
     
      jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken("JWT"),
      secretOrKey : "Mysecretcode" },
      (jwt_payload,done)=>{
            
            modelUser.findOne({where:{email: jwt_payload.email}})
                     .then((users)=>{
                          if(users){

                              var info_token={
                              name: users.name,
                              email: users.email
                            }
                          
                           done(null,info_token)
                          }
                          else{
                            done(null,false,{message: "Authentication has expired"})
                          }
                        })
                        .catch((err)=>done(err))
             }
          ))
  