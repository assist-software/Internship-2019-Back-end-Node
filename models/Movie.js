const Sequelize= require('sequelize');
const db= require('../db/db');
const bcrypt = require('bcrypt');

const Model = Sequelize.Model;

/* Movie Model
{ 
    id: <autoincrement>, 
    title: < string, required > , 
    trailerUrl: < string, url validation, required > , 
    originalSourceUrl: < string, url validation, required > , 
    coverUrl: < string, url validation, required > , 
    imdbId: < string , required > , 
    imdbScore: < number > , 
    description: < string > , 
    releaseDate: < Datetime, required > 
}   */

class Movie extends Model{}

Movie.init({
    // attributes
    title: {
      type: Sequelize.STRING,
      require: true,
      allowNull: false
    },
    trailerUrl: {
        type: Sequelize.STRING, 
        require: true,
        isUrl: true
      }, 
      originalSourceUrl: {
        type: Sequelize.STRING, 
        isUrl: true
      }, 
      coverUrl: {
        type: Sequelize.STRING, 
        isUrl: true
      },
      imdbId: {
        type: Sequelize.STRING,
        require: true, 
      },

      imdbScore: {
        type: Sequelize.STRING, 
      },
      
      description: {
        type: Sequelize.STRING, 
      },
      duration:{
        type: Sequelize.STRING,
      },
      director:{
        type: Sequelize.STRING,
      },
      stars:{
        type: Sequelize.STRING,
      },
      category:{
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      releaseDate: {
        type: Sequelize.DATEONLY,
        require: true 
      }
  }, {
      sequelize: db,
      modelName: 'Movie'
    // options
  }
  );
  

  Movie.insert_default= async ()=>{

    const empt = await Movie.count().then((c)=>{return c});
    if(empt==0)
    {
      //todo convert string to timestamp for releasedate
      Movie.create({title: 'Default', trailerUrl: 'Default', originalSourceUrl:'Default', coverUrl:'Default', imdbId:'Default',
    imdbScore:'Default', description:'Default', duration : '2:30', director: 'Default', stars: 'Default', category:['Default', 'Default'] , releaseDate: Date.now()});
  
    }else {console.log('\n *** USER DEJA ARE DEFAULT *** \n ')}
  
  }




module.exports= Movie;