const Sequelize = require('sequelize');
const Model=Sequelize.Model
const db=require("../db")
const modelCategory=require("./category")
const UnionTable=require("./UnionTable")

const movie=db.define('movie',{

  id:{
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey:true
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

  imdbScore:{
     type: Sequelize.FLOAT
  },

  description:{
      type: Sequelize.STRING
  },
  
  releaseDate:{
      type: Sequelize.BIGINT,
      require:true
  },

  duration:{
      type:Sequelize.STRING
  },

  director:{
      type:Sequelize.STRING
  },
  
  writers:{
      type:Sequelize.STRING
  },

  stars:{
      type:Sequelize.STRING
  }

})



module.exports=movie