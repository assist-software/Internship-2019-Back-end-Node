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


route.post("/movie",async(req,res)=>{
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
    var category=req.body.category.split(",")
   
    //The folowing fild's can't be empty
    if(!title || !trailerUrl || !originalSourceUrl || !coverUrl || !imdbId || !releaseDate || !category)
     res.send({message: "There are some fild witch must be filled"})
    

    else{
      // Search for a movie with the same imdbId
      modelMovie.findOne({where:{imdbId: imdbId}})
                .then(async(movies)=>{
                  if(movies){ 
                   
                   res.send({message: "The movies is already in database",movies})}
                  else
                   {
                    //Create the new movie
                    try{
                    var movie= await modelMovie.create({title: title,trailerUrl: trailerUrl,originalSourceUrl:originalSourceUrl,
                                                        coverUrl:coverUrl, imdbId: imdbId,imdbScore:imdbScore,description:description,
                                                        releaseDate:releaseDate  })
                    
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
                   
                   
            })         
       }
   }
})
  route.post('/category',function(req,res){ 
    

    if(req.user.role===2)
      res.send({message: "Just admin can acces this page"})
    else{
      if(!req.body.name)
      res.send({message: "The fild must be filled"})
      else{
      modelCategory.findOne({where: {'name': req.body.name}})
                   .then((category)=>{
                            
                            if(category!==null)
                                res.status(200).send({message:"The category already is in database",name: category.name,id: category.id})
                            else
                            { try{
                              modelCategory.create({'name':req.body.name})
                                           .then((category)=>{res.status(200).send({id: category.id , name: category.name})})
                                           .catch((error) => {res.status(200).send("Some error")})
                            }
                            catch(err){
                              console.log(err.errors)
                              res.json(err.errors)
                            }
                            }
                        }  )
                   .catch((err)=> res.send({message:"Server error"}))
             }
        }
    })

  route.get('/category',(req,res)=>{
      modelCategory.findAndCountAll({attributes: ['id','name']})
                   .then(categories => {
                      if(categories!==null)
                        res.status(200).send(categories.rows)
                      else{
                        res.status(404).send("Categories not found")
                      }
            })
    })
   
   /**  This function will return an object that contains a movie once its categories are joined */
   async function cauta_categ(movies){
      var mmov
      var category=[]
      await UnionTable.findAll({where: { movieId: movies.id}})
                .then(async(id_cat)=>{
        if(id_cat){
           for(var i=0;i<id_cat.length;i++) {
           var categorys=  await modelCategory.findOne({where: {id: id_cat[i].categoryId}})
           if(categorys){
            var ob={
              id: categorys.id,
              name: categorys.name
            }
            category.push(ob)
           }
          }
          //Build a new object to put all the information
          var movie={
            id: movies.id,
            title: movies.title,
            trailerUrl: movies.trailerUrl,
            originalSourceUrl: movies.originalSourceUrl,
            coverUrl: movies.coverUrl,
            imdbId: movies.imdbId,
            imdbScore: movies.imdbScore,
            description: movies.description,
            releaseDate: movies.releaseDate,
            createdAt: movies.createdAt,
            updatedAt: movies.updatedAt,
            category: category
          } 
          mmov=movie
        }
     })
   
     return mmov
    }


    route.get("/movie/query",(req,res)=>{

      var limit=req.query.limit
      var skip=req.query.skip
      var from=parseInt(req.query.from)
      var to=parseInt(req.query.to)
      
      var date_from=new Date(from)
      var date_to=new Date(to)
      
      modelMovie.findAll({ limit: limit,offset:skip,where: {releaseDate: {[Op.gt]: date_from,[Op.lt]: date_to} }})
                .then(async (movies)=>{
                  if(movies){
    
                     var movie_vector=[]
                     for(var i=0;i<movies.length;i++){
                      
                       movie=await cauta_categ(movies[i])
                       movie_vector.push(movie)
                      }
                    
                      res.send(movie_vector)
                  }
                }
            )}
      )


   /** This route is used to delet a movie*/
   route.delete("/movie/:id",(req,res)=>{
    /**Can be accesed just by admin */
    
    if(req.user.role==2){
      res.send({message: "Just admin can acces this page"})
    }
   else{
     var id=req.params.id

     // Find the movie with the id from url
     modelMovie.findOne({where:{id: id}})
               .then((movie)=>{
                   if(!movie)
                     res.status(404).send({message: "the movie is not in database"})
                   else{
                     modelMovie.destroy({where:{id:id}})
                               .then(()=>res.status(200).send({mesagge: "The movie has been deleted"}))
                               .catch((err)=> console.log("There is a problem with the server"))
                       }
                   })
               .catch((err)=> console.log("There is a problem with the server"))
       } 
 })

  route.get("/movie/:id",(req,res)=>{
   
    var id=req.params.id

    modelMovie.findOne({where:{id: id}})
              .then( (movies)=>{
                if(movies){
                   category=[]
                  UnionTable.findAll({where: { movieId: movies.id}})
                            .then(async(id_cat)=>{
                              if(id_cat){
                                 for(var i=0;i<id_cat.length;i++) {
                                 var categorys=  await modelCategory.findOne({where: {id: id_cat[i].categoryId}})
                                 if(categorys){
                                  var ob={
                                    id: categorys.id,
                                    name: categorys.name
                                  }
                                  category.push(ob)
                                  
                                  
                                 }
                                }
                                //Build a new object to put all the information
                                var movie={
                                  id: movies.id,
                                  title: movies.title,
                                  trailerUrl: movies.trailerUrl,
                                  originalSourceUrl: movies.originalSourceUrl,
                                  coverUrl: movies.coverUrl,
                                  imdbId: movies.imdbId,
                                  imdbScore: movies.imdbScore,
                                  description: movies.description,
                                  releaseDate: movies.releaseDate,
                                  createdAt: movies.createdAt,
                                  updatedAt: movies.updatedAt,
                                  category: category
                                }
                                 res.send({movie})
                              }
                          })
                      }
                else{
                  res.status(404).send({message: "The movie is not in database"})
                }
              })
                .catch((err)=> console.log("There is a problem with the server"))
 })


route.get('/category/:id',(req,res)=>{
   var categoryId=req.params.id
   modelCategory.findOne({where: {'id': categoryId}})
                .then((category)=>{
                  if(category!==null)
                    res.status(200).send({mesagge: "Category found",id: category.id,name: category.name})
                  else
                    res.status(404).send("Category not found")
     })
})

module.exports=route