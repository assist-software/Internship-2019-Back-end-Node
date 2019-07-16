var express=require("express")
var route=express.Router()
var passport=require("passport")
var bodyParser= require("body-parser")
const uuid4=require("uuid/v4")
const nodemailer=require("nodemailer")
const modelUser=require("./../models/user")

route.post('/id',(req,res)=>{ 
    
    console.log(req)
    var info={
        username: req.user.name,
        email: req.user.email,
        status: "Succes"
    }
    res.send(info)
  })

module.exports=route