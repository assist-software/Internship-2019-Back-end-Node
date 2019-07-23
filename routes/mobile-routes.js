//models import
const User= require('../models/User');
const Category= require('../models/Categories');
const Movie= require('../models/Movie');
const MovieCategory=require('../models/MovieCategory');

const express = require('express');

const mobileRouter = express.Router();
const db= require('../db/db');


//Get route to return all movies from the database
mobileRouter.get('/movies' ,function(req, res, next){
 Movie.findAll().then( function(Movie) {
        res.json(Movie);
      });
} )


//Get route to return all categories from the database
mobileRouter.get('/category', function (req, res) {
    Category.findAll().then( function(categories) {
      res.json(categories);
    });
   });
  
/*  2019-12-13   */

/*
//POST ROUTES
//ADD A MOVIE AND INCREMENT 
   mobileRouter.post('/movie', async (req, res, next) => {
       let body= req.body;
    let categories= body.categories.trim(' ').split(',');
    let stringDate=body.releaseDate.split('-');
   let dateFormatdate= new Date(stringDate[0], stringDate[1] - 1, stringDate[2]);
    let title= req.body.title; 
    var found = await Movie.findOne({where: { title : title }});
    console.log('\n Categories', categories);
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
      coverUrl:body.coverUrl,
       imdbId:body.imdbId,
  imdbScore:body.imdbScore,
   description:body.description,
   duration: body.duration,
   director: body.director,
   stars: body.stars, 
   categories: categories,
    releaseDate:dateFormatdate}).then(function(result){
       for(let i=0; i<categories.length; i++)
       {
           let k =  Category.increment('numberOfMovies', {where: {name: categories[i]}}).then((result)=>{return result});
       }
    }
    );
res.json({
  message: 'The created movie is : ',
  Movie: newMovie,
});
console.log('\nNew Movie created, Movie properties : ', newMovie);
}
  });

*/




module.exports= mobileRouter;