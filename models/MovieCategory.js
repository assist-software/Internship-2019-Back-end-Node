const Sequelize= require('sequelize');
const db= require('../db/db');
const bcrypt = require('bcrypt');


const Model = Sequelize.Model;

class MovieCategory extends Model{}


MovieCategory.init({
    // attributes
    
  }, {
      sequelize: db,
      modelName: 'MovieCatebory'
    // options
  }
  );
  

 



  module.exports= MovieCategory;