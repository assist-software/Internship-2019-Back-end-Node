const Sequelize= require('sequelize');
const db= require('../db/db');
const Model = Sequelize.Model;

/*
Category Model
{ 
  id: <autoincrement>, 
  name: < string, required, unique >  
}
*/

class Category extends Model{};


Category.init({
    // attributes
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true, 
      allowNull: false
    },
    numberOfMovies: {
     type: Sequelize.INTEGER,
     defaultValue: 0,  
    }

  }, {
      sequelize: db,
      modelName: 'Category'
    // options
  }
  );


  Category.insert_default = async (adm)=>{
    const empt = await Category.count().then((c)=>{return c});
    if(empt==0)
    {
        var categories = ["Action", "Adventure", "Animation", "Biography", "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", "Film Noir", "History", "Horror", "Music", "Musical", "Mystery", "Romance", "Sci-Fi", "Short Film", "Sport", "Superhero", "Thriller", "War", "Western"];
        categories.forEach( element =>
            Category.create({name: element}) );
    }else {console.log('\n *** DEFAULT CATEGORIES ALREADY ADDED *** \n ')}
  }
  


  module.exports = Category;