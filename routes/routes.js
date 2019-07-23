const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Passport= require('../auth/auth');
const router = express.Router();
const bcrypt = require('bcrypt');
const db= require('../db/db');
const cors=require('cors');
const user= require('../models/User');
const nodeMailer = require('nodemailer');
const localStrategy = require('passport-local').Strategy;
const Movie= require('../models/Movie');
const Category=require('../models/Categories');
const MovieCategory= require('../models/MovieCategory');
const gravatar= require('gravatar');

router.use(cors());
//Signup route.POST

router.post('/signup', passport.authenticate('signup', { session : false /* , successRedirect: '/signup/success', failureRedirect: '/signup/fail',*/ }) , async (req, res, next) => {
let user= req.user;
if(user==1)
{res.json('Email aready taken')}
else if(user==2){
  res.json('Password != confirm ')
}else {res.json('Signup successfull')}

})
;
//End signup route
router.get('/signup/fail', async(req, res, next)=>{ console.log(req.message); res.json('Signup failed')});
router.get('/signup/success', function(req, res){res.json('Signup success')});



//Signup route.GET
router.get('/signup',function (req, res, next) {
  res.send('Pagina de signup');
 });




//Login Route.POST
router.post('/login', async (req, res, next) => {
  passport.authenticate('login', async (err, user, info) => {  
         try {
      if(err || !user){
        const error = new Error('An Error occured')
        return next(error);
      }
      req.login(user, { session : false }, async (error) => {
        if( error ) return next(error)
        //We don't want to store the sensitive information such as the
        //user password in the token so we pick only the email and id
        let user=req.user;
        if(user ==1)
        {
          res.json('Email provided was not found');
        }else if (user ==2)
        {
          res.json('Password incorrect');
        }else {
          const body = { _id : user._id, email : user.email, rol: user.RoleId };
          //Sign the JWT token and populate the payload with the user email and id
          const token = jwt.sign({ user : body },'top_secret');
          //Send back the token to the user
          return res.json({ token : token, Rol : body.rol});

        }

      });     } catch (error) {
      return next(error);
    }
  })(req, res, next);
});
//End login route


//Password reset route.POST
router.post('/reset', async(req, res, next)=>{
  let email= req.body.email;
  console.log(email);
  let FindUser=await user.findOne({where:{email: email}});
  if(FindUser)
  {
  let newPassword= generate_random_string(16);
  var hash= await bcrypt.hash(newPassword, 10);
  sendMail(FindUser, newPassword);
  let k = await user.update({ passwordHash : hash }, { where: { email: FindUser.email } }).then((result) => {
      console.log(result);
  });
  res.json({
    message: 'Password reset performed successfull for user '+ FindUser.email + '.\n New password send to user via email.'
  })
  }else {
  console.log('\n Email provided was not found');
  req.json({
    message:'Email provided was not found'
  })
  }
  })
  //End password reset route

//Password reset route.GET
router.get('/reset', async(req, res, next)=>{
  res.json({
  message: 'Pagina de reset'
});
  })





/* http://localhost:3001/movies?category_like=3 */
//return movie by category name 
router.get('/movies/get/?', async function (req, res, next){
  let name=req.query.category_like;
  if(name== undefined)
  return(next);
  //console.log('\n\n name ', name );
  let id= await Category.findOne({where: {name: name}});
  id=id.id;
  //console.log('\n id : ', id);
  let MovieFound= await MovieCategory.findAll({where: {CategoryId: id }});
  //console.log('\n\n MOvie found', MovieFound);
  let checkId=[];
for(let i=0; i<MovieFound.length; i++){
checkId.push( await Movie.findOne({where: {id:MovieFound[i].MovieId }}));
}
  console.log('\n query baza de date ', Date.now());
res.json( checkId)
  })



/*
//Get route to return all movies from the database
router.get('/movies' ,function(req, res, next){
  Movie.findAll().then( function(Movie) {
         res.json(Movie);
       });
 } )
*/
/*
//return movie by id
  router.get('/movies' ,function(req, res, next){
    let id= req.query.id;
    let checkid= req.params;
    console.log('\n id ', id);
    console.log('\n check id', checkid);
   Movie.findOne({where: {id: id}}).then( function(Movie) {
          res.json(Movie);
        });
  } )
 */



router.get('/movies' ,function(req, res, next){
  Movie.findAll().then( function(Movie) {
         res.json(Movie);
       });
 } )


//return movie by id
router.get('/movies/:id' ,function(req, res, next){
  let checkid=req.params.id;
  console.log('\n checkid ', checkid);
  if(checkid!=undefined){
 Movie.findOne({where: {id: checkid}}).then( function(Movie) {
        res.json(Movie);
      });
    }else {
      Movie.findAll().then( function(Movie) {
        res.json(Movie);
      });
    }
} )


//return all categories
  router.get('/category', function (req, res) {
    Category.findAll().then( function(categories) {
      res.json(categories);
    });
   });


   //return all categories
  router.get('/category/:id', function (req, res) {
    let id= req.params.id;
    Category.findOne({where: {id: id}}).then( function(categories) {
      res.json(categories);
    });
   });
  



//Generate random string for password reset 
  function generate_random_string(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
//End random string generator



//Emailer
 let sendMail = function(user, newPassword, req, res){
  const transporter = nodeMailer.createTransport({
    host: 'debugmail.io',
    port: 25,
    secure: false,  //true for 465 port, false for other ports
    auth: {
      user: 'roscaroberto21@gmail.com',
      pass: 'f29803b0-a94f-11e9-bfe6-b3d903c101e3'
    }
  });
  let mailOptions = {
    from: '"WatchNext Admin" <admin@watchnext.com>', // sender address
    to: user.email, // list of receivers
    subject: 'WatchNext Password Reset', // Subject line
    text: 'Dear ' + user.username + ' your new password is '+ newPassword, // plain text body
    html: '<b>WatchNext Admin</b>' // html body
  };
  transporter.sendMail(mailOptions, user,  (error, info) => {
    if (error) {
      console.log(error);
      res.send({success: false})
    } else {
      res.send({success: true});
    }
  });
}
//End emailer





/*
//FOR DEBUG HERE ONLY, SHOULD BE SECURISED
//only for admin shoud be
router.post('/movies/add', async (req, res, next) => {
 // let user = req.user;
 let body=req.body;
  let helpCateg=body.category.split(',');
  let categories= body.categories.trim(' ').split(',');
  let stringDate=body.releaseDate.split('-');
 let dateFormatdate= new Date(stringDate[0], stringDate[1] - 1, stringDate[2]);
 console.log('\n \n help Categ ', helpCateg);
  let title= req.body.title;
  let catID;let newm;
  var found = await Movie.findOne({where: { title : title }});
  let rol=1;
if(rol==1)
{
//is Admin : true
if(found)
{
console.log('Movie with the same name already exists');
res.json({
message: 'Movie with the same name already exists',
movieUrl: found.originalSourceUrl
});
}else {
let newMovie= await Movie.create({title: body.title,
 trailerUrl: body.trailerUrl, 
 originalSourceUrl: body.originalSourceUrl , 
  coverUrl:body.coverUrl, imdbId:body.imdbId,
imdbScore:body.imdbScore,
 description:body.description,
duration: body.duration,
director: body.director,
stars: body.stars,
category: helpCateg,
 releaseDate:dateFormatdate});
for(let i=0; i<categories.length; i++)
{
 catID=await Category.findOne({where: {name: categories[i]}});
let k =  await Category.increment('numberOfMovies', {where: {name: categories[i]}}).then((result)=>{return result});
newM=await MovieCategory.create({MovieId: newMovie.id, CategoryId: catID.id}).then((result)=>{return result});
}
res.json({
message: 'The created movie is : ',
title: newMovie.title,
MovieIdfromDatabase: newMovie.id
});
//console.log('\nNew Movie created, Movie properties : ', newMovie);
}
}else if(rol==2)
{
//is Admin : false
res.json({
message: 'error 100500. Unauthorized access'
})
}else {
//Should be impossible
res.json({
message: 'error 100500. No logged in user. Do you want to log in ? '
})
}
});
*/

/*   FOR DEBUG HERE ONLY, SHOULD BE A SECURE ROUTE


///DELETE ROUTE FOR ADMIN ONLY
router.delete('/movies/:id', async (req, res, next)=>{
  let id= req.params;
 // let user= req.user;
  id= id.id;
  console.log(' \n id ', id );
  let found = await Movie.findOne({where: {id: id}});
  console.log('\n found ', found);
  console.log('\n user ', user);
  let rol=1;
  if(rol==1){
  if(found)
  {
  let MC=await  MovieCategory.findAll({where: {MovieId: found.id}});
  console.log('\n \n\n MC', MC);
  let decrement;
  let check_how_many=0;
  for(let i=0; i<MC.length; i++)
  {
    decrement= await Category.decrement('numberOfMovies', {where:{id: MC[i].CategoryId}});
    console.log('\n \n mc ', MC[i]);
    check_how_many++;
  }
  console.log('\n check how many', check_how_many);
  let check;
  let copy=found;
  check=await found.destroy();
  console.log('\n\n Am Distrus');
  res.json({
    message:'Movie deleted',
    Movie: copy,
  })
  
  }else{
  res.json({
  message: 'Requested movie not found. Maybe it was deleted already?'
  })
  }
  }else {
    res.json({
      message: 'You are not authorized to make this change'
    })
  }
    //todo delete from MovieCategory
  })
*/






 


  module.exports = router;
