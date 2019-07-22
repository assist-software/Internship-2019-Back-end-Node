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

route.get("/",(req,res)=>{

    res.send("Salut maaaaaaaaaaaiiii");
})


/**Route for sign-up */
route.post('/signup', function(req,res,next){
    
    passport.authenticate('signup', function(err, user, info) {
        
        if(err!=null){
            res.status(500).send("Error")
        }
        else{ 
        if(!user){
           res.status(409).send(info)
        }
        else{
            res.status(201).send(info)
        }}
    })(req,res,next)
})
/**Route for sign-in */
route.post('/signin',function(req,res,next){

    passport.authenticate('signin',function(err,user,info){
        if(err){
            
            res.status(500).send(info)
        }
        else{ 
        if(!user){
           res.status(409).send(info)
        }
        else{
            res.status(201).send(info)
        }}
    })(req,res,next)
})

/**Route for reset password */
route.post('/reset-password',function(req,res){
    email=req.body.email
    
    /**Using uuid for generating a new password */
    var newpass=uuid4()
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    /** Creating the transporter for email */
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
   
    newpass='A'+newpass

    var mailOptions = {
        from: 'croitorgheorghi@yahoo.com', // sender address
        to: email, // list of receivers
        subject: 'Hello', // subject line
        text: 'Hello ! This is the new password: '+newpass, // plain text body
    };
   
    /** Send mail and if the acction is successfully update the data base with the new password */
    transporter.sendMail(mailOptions, async(error, info) => {
        if (error) {
            console.log(error);
            res.status(400).send({success: false})
        } else {
           var user=await modelUser.findOne({where:{email: req.body.email}})
              if(!user)
                res.status(404).send({success: false, message: "The user is not in database"})       
              else{
                let update_value={passwordHash: newpass}
                var update=await modelUser.update(update_value,{where: {'email': req.body.email}})
                   if(update==1)
                   res.status(200).send({success: true})
                         }       
        }
    });

})

 /**Route for profile ( secure route-> only authenticated user can acces) */
 route.post('/profile',(req,res,next)=>{ 
   passport.authenticate("jwt",{session: false},(err,user,info)=>{

     
     if(err){
         res.status(409).send("There is a problem")
     }
     else{ 
     if(user === false){
        res.status(409).send(info.message)
     }
     else
     {
         res.status(201).send(user)
     }}
   })(req,res,next)
 })

route.get('/api/category',async(req,res)=>{
   var categories=await modelCategory.findAndCountAll({attributes: ['id','name']})
      if(categories!==null)
          res.status(200).send(categories.rows)
      else
          res.status(404).send("Categories not found")               
          })

 
 
 /**  This function will return an object that contains a movie once its categories are joined */
 async function cauta_categ(movies){
    var mmov
    var category=[]
    var id_cat=await UnionTable.findAll({where: { movieId: movies.id}})
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
          duration: movies.duration,
          director:movies.director,
          writers: movies.writers,
          stars:movies.stars,
          category: category
        } 
        mmov=movie
      }
   return mmov
  }

 route.get("/api/movie/query",async(req,res)=>{

    var limit=req.query.limit
    var skip=req.query.skip
    var from=parseInt(req.query.from)
    var to=parseInt(req.query.to)
    
    //var date_from=new Date(from)
    //var date_to=new Date(to)
    
    var movies=await modelMovie.findAll({ limit: limit,offset:skip,where: {releaseDate: {[Op.gt]: from,[Op.lt]: to} }})
    
    if(movies[0]!==undefined){
      
      var movie_vector=[]
      for(var i=0;i<movies.length;i++){
         movie=await cauta_categ(movies[i])
         movie_vector.push(movie)
          }
         res.send(movie_vector)
      }
     else
       res.send({message: "Empty"})
     }
    )

route.get("/api/movies", async(req,res)=>{
  var movies=await modelMovie.findAll()

  if(movies[0]!=undefined){
  var movie_vector=[]
  for(var i=0;i<movies.length;i++){
   
    movie=await cauta_categ(movies[i])
    movie_vector.push(movie)
   }
 
   res.send(movie_vector)
 }
  else
     res.send({mesagge: "The data base is empty"})

})



route.get('/api/category/:id',async(req,res)=>{
      var categoryId=req.params.id
      var category=await modelCategory.findOne({where: {'id': categoryId}})
         if(category!==null)
            res.status(200).send({mesagge: "Category found",id: category.id,name: category.name})
         else
            res.status(404).send({message:"Category not found"})
          })

route.get('/api/movies-category/:id',async(req,res)=>{

  var id=req.params.id
  var id_movie=await UnionTable.findAndCountAll({where:{categoryId:id}})

  //res.send(id_movie)
  var movies=[]
  for(var i=0;i<id_movie.count;i++){
  var movie=await modelMovie.findOne({where:{id:id_movie.rows[i].movieId}})
  console.log(movie)
  movies.push(movie)
  }

  
  
  res.send({count: id_movie.count,movies: movies})
})

route.get("/api/movie/:id",async(req,res)=>{
   
        var id=req.params.id
    
        var movies=await modelMovie.findOne({where:{id: id}})
           
           if(movies!=null){ 
           category=[]
           var id_cat=await UnionTable.findAll({where: { movieId: movies.id}})
               if(id_cat){
                  for(var i=0;i<id_cat.length;i++) {
                     var categorys=  await modelCategory.findOne({where: {id: id_cat[i].categoryId}})
                     if(categorys){
                       var ob={
                        id: categorys.id,
                        name: categorys.name}
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
                      duration: movies.duration,
                      director:movies.director,
                      writers: movies.writers,
                      stars:movies.stars,
                      category: category
                        }
                      res.send({movie})
                          }}
                    else
                      res.status(404).send({message: "The movie is not in database"})
                        
     })
module.exports=route