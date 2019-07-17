const Sequelize = require('sequelize');
const Model=Sequelize.Model
const db=require("../db")
const modelMovie=require("./category")
const UnionTable=require("./UnionTable")

const category = db.define('category', {
    // attributes
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey:true
    },
    name: {
      type: Sequelize.STRING,
      require: true,
      unique: true,
      validate:{
        notEmpty: true
      }
    },
    
})

category.insertDefaultcategory=async () =>{ 
  const allcategories=await category.findAll()
      if(allcategories.length==0)
      {
              console.log("-----------Database is empty and we need to create new categories")
              await category.create({name: 'Action'})
              await category.create({name: 'Adventure'})
              await category.create({name: 'Animation'})
              await category.create({name: 'Biography'})
              await category.create({name: 'Comedy'})
              await category.create({name: 'Crime'})
              await category.create({name: 'Documentary'})
              await category.create({name: 'Drama'})
              await category.create({name: 'Family'})
              await category.create({name: 'Fantasy'})
              await category.create({name: 'Film Noir'})
              await category.create({name: 'History'})
              await category.create({name: 'Horror'})
              await category.create({name: 'Music'})
              await category.create({name: 'Musical'})
              await category.create({name: 'Mystery'})
              await category.create({name: 'Romance'})
              await category.create({name: 'Sci-Fi'})
              await category.create({name: 'Short Film'})
              await category.create({name: 'Sport'})
              await category.create({name: 'Superhero'})
              await category.create({name: 'Thriller'})
              await category.create({name: 'War'})
              await category.create({name: 'Western'})
      }
}
module.exports=category