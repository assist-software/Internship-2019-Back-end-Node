var express=require("express")
var route=express.Router()
var passport=require("passport")
var bodyParser= require("body-parser")
const uuid4=require("uuid/v4")
const nodemailer=require("nodemailer")
const modelUser=require("./../models/user")
const modelMovie=require("./../models/movie")
const modelCategory=require("./../models/category")
const Sequelize = require('sequelize');
const Op=Sequelize.Op
const UnionTable=require("./../models/UnionTable")


route.post("/movie",passport.authenticate("jwt",{session:false}),async(req,res)=>{
  // Check if the role is admin (role is send with token)
  if(req.user.role===2)
   res.send({message: "Just admin can acces this page"})
  else{
    /** Take the body from request */
    var title=req.body.title
    var trailerUrl=req.body.trailerUrl
    var originalSourceUrl=req.body.originalSourceUrl
    var coverUrl=req.body.coverUrl
    var imdbId=req.body.imdbId
    var imdbScore=req.body.imdbScore
    var description=req.body.description
    var releaseDate=req.body.releaseDate
    var category=req.body.category
    var duration=req.body.duration
    var director=req.body.director
    var writers=req.body.writers
    var stars=req.body.stars
    //The folowing fild's can't be empty
    if(!title || !trailerUrl || !originalSourceUrl || !coverUrl || !imdbId || !releaseDate || !category)
     res.send({message: "There are some fild witch must be filled"})
    
    

    else{
      category=req.body.category.split(",")
      // Search for a movie with the same imdbId
      var movies=await modelMovie.findOne({where:{imdbId: imdbId}})
          if(movies)
            res.send({message: "The movies is already in database",movies})
          else {
          //Create the new movie
             try{
               var movie= await modelMovie.create({title: title,trailerUrl: trailerUrl,originalSourceUrl:originalSourceUrl,
                                                        coverUrl:coverUrl, imdbId: imdbId,imdbScore:imdbScore,description:description,
                                                        releaseDate:releaseDate,duration: duration,director:director,writers: writers,stars:stars  })
                    
               //Creating the relationship between the movie and category ind insert in table 
              for(let i=0;i<category.length;i++){
                  const categ=await modelCategory.findOne({where: {name: category[i]}})
                  if(!categ)
                      res.status(400).send({mesagge:"Category was not found"})
                  else
                      await UnionTable.create({categoryId: categ.id,movieId: movie.id})       
                    } 

                    res.status(201).send({movie, id: movie.id})
                  }catch(err){
                    console.log(err.errors)
                    res.json(err.errors)
                  }
                }
              }
            }       
          } 
        )         

  route.post('/category',passport.authenticate("jwt",{session:false}),async function(req,res){ 
    

    if(req.user.role===2)
      res.send({message: "Just admin can acces this page"})
    else{
      if(!req.body.name)
      res.send({message: "The fild must be filled"})
      else{
      var category_name= await modelCategory.findOne({where: {'name': req.body.name}})
          if(category_name!==null)
            res.status(200).send({message:"The category already is in database",name: category.name,id: category.id})
          else{ 
              var category=await modelCategory.create({'name':req.body.name})
              if(category!=null)
                res.status(200).send({id: category.id , name: category.name})
              }
           }
          }
     } 
  )  
                
   route.put("/movie/:id",passport.authenticate("jwt",{session:false}),async(req,res)=>{

    var id=req.params.id
    if(req.user.role===2)
    res.send({message: "Just admin can acces this page"})
   else{
     /** Take the body from request */
     var title=req.body.title
     var trailerUrl=req.body.trailerUrl
     var originalSourceUrl=req.body.originalSourceUrl
     var coverUrl=req.body.coverUrl
     var imdbId=req.body.imdbId
     var imdbScore=req.body.imdbScore
     var description=req.body.description
     var releaseDate=req.body.releaseDate
     var category=req.body.category
     var duration=req.body.duration
     var director=req.body.director
     var writers=req.body.writers
     var stars=req.body.stars

     if(!category)
     res.send({message: "There are some fild witch must be filled"})
     
     var update= await modelMovie.update({title: title,trailerUrl: trailerUrl,originalSourceUrl:originalSourceUrl,
      coverUrl:coverUrl,imdbId:imdbId,imdbScore:imdbScore,description:description,
      releaseDate:releaseDate,duration: duration,director:director,writers: writers,stars:stars },{where:{id:id} })

      if(update==1){
        res.status(200).send({mesagge: "Movie is now update"})
      }
      else
        res.status(404).send({mesagge: "Id not found"})
    }
   })                     

  
   /** This route is used to delet a movie*/
   route.delete("/movie/:id",passport.authenticate("jwt",{session:false}),async(req,res)=>{
    /**Can be accesed just by admin */
    
    if(req.user.role==2){
      res.send({message: "Just admin can acces this page"})
    }
   else{
     var id=req.params.id

     // Find the movie with the id from url
     var movie=await modelMovie.findOne({where:{id: id}})
      if(!movie)
         res.status(404).send({message: "the movie is not in database"})
      else{
          var destr=await modelMovie.destroy({where:{id:id}})
          var destrUnion=await UnionTable.destroy({where:{movieId:id}})
          if(destr===1)
                  res.status(200).send({mesagge: "The movie has been deleted"})
            
      }
      }  
   }
   )

  

module.exports=route