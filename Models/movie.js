const Sequelize = require('sequelize');
const Model=Sequelize.Model
const db=require("../db")

const movie=db.define('movie',{

  id:{
      type: Sequelize.INTEGER,
      autoIncrement: true
  },
  title:{
      type: Sequelize.STRING,
      require: true,
      
  },
  trailerUrl: {
      type: Sequelize.STRING,
      require:true,
      validate:{
          isUrl:true
      }
  },

  originalSourceUrl:{
      type: Sequelize.STRING,
      require:true,
      validate:{
          isUrl: true
      }
  },

  coverUrl:{
      type:Sequelize.STRING,
      require:true,
      validate:{
          isUrl:true
      }
  },

  imdbId:{
      type:Sequelize.STRING,
      require:true
  },

  imbdScore:{
     type: Sequelize.NUMBER 
  },

  description:{
      type: Sequelize.STRING
  },
  
  releaseDate:{
      type: Sequelize.DATE
  }


})

module.exports=movie