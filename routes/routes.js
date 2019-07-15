var express=require("express")
var route=express.Router()
var passport=require("passport")
var bodyParser= require("body-parser")
const uuid4=require("uuid/v4")
const nodemailer=require("nodemailer")
const modelUser=require("./../models/user")


route.get('/',(req,res)=>{

    res.send("Hello world")
})

route.post('/signup', function(req,res,next){
    
    passport.authenticate('signup', function(err, user, info) {
        //res.send(req.body)
        if(err){
            res.status(500).send(info.message)
        }
        else{ 
        if(!user){
           res.status(409).send(info.message)
        }
        else{
            res.status(201).send(info.message)
        }}
    })(req,res,next)
})


route.post('/signin',function(req,res,next){

    passport.authenticate('signin',function(err,user,info){
        if(err){
            //console.log(err)
            res.status(500).send(info.message)
        }
        else{ 
        if(!user){
           res.status(409).send(info.message)
        }
        else{
            res.status(201).send(info.message)
        }}
    })(req,res,next)
})

route.post('/reset-password',function(req,res){
   email=req.body.email

   const newpass=uuid4()
   process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
   var transporter = nodemailer.createTransport({
    host: 'debugmail.io',
    port: 25,
    secure: false,
    ignoreTLS: true,

    auth: {
      user: 'croitorgheorghita@gmail.com',
      pass: 'c1e147c0-a672-11e9-a92a-153f6747ec08'
    }
  });
    var mailOptions = {
        from: 'croitorgheorghi@yahoo.com', // sender address
        to: email, // list of receivers
        subject: 'Hello', // Subject line
        text: 'Hello ! This is the new password: '+newpass, // plain text body
    };
   
    //res.send(newpass)

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(400).send({success: false})
        } else {
            let update_value={passwordHash: newpass}
            modelUser.update(update_value,{where: {'email': req.body.email}})
                     .then(()=>res.status(200).send({success: true}))
            
        }
    });

})

module.exports=route