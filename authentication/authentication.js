const passport=require("passport")
var localStrategy=require("passport-local").Strategy
//const sequelize=require("sequelize")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const modelRole=require("./../models/role")
const modelUser=require("./../models/user")


passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  const Sequelize = require('sequelize');
  const sequelize = new Sequelize('postgres', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres'
  });
function isEmptyObject(obj) {
    return !Object.keys(obj).length;
  }

/*.catch((error)=>{console.log("Something wrong is happening")
               done(null,false,{message: "Error in database"})
              })    */
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
                                modelUser.create({'name':'User', 'email': req.body.email ,'passwordHash':req.body.password})
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
      
        //console.log(req.body.email,req.body.password)
        //return done(null,false,{message: "Authentication has expired"})
        console.log(modelUser)
        console.log(req.body.email)
        modelUser.findOne({where:{'email': req.body.email}})
            .then((users)=>{ //console.log(users)
                if(users===null)
                  done(null,false,{message: "User was not found"})
                else
                  { /*console.log(users)
                    console.log(req.body.password)
                    console.log(this.password)*/
                    bcrypt.compare(req.body.password,users.passwordHash,(err,match)=>{
                      
                          if(match){ 
                          var pay=users.toJSON()
                          //var payload=pay.toJSON()
                          var token=jwt.sign(pay,"Mysecretcode",{algorithm: 'HS256',expiresIn: '2h'})
                          jwt.verify(token,"Mysecretcode",(err,good)=>{
                               if(good && !err)
                                return done(null,users,{message:"JTW"+ token})
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
           
    
       ///  } ))
  