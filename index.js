try{
const Sequelize = require('./db/db');
const User = require('./models/User');
const Role = require('./models/Role');
const Category=require('./models/categories');
const models= Sequelize.Model;
const express = require('express');
var cors = require('cors');
const path = require('path');
var app = express();
const route = require('./routes/routes');
const secureRoute = require('./routes/secure-route');
const passport = require('passport');
const Movie= require('./models/movie');
const MovieCategory=require('./models/MovieCategory');
const mobileRouter= require('./routes/mobile-routes');


app.use(express.json());
//Define the routes
app.use('/', route);
//Define the mobile routes
app.use('/mobile', mobileRouter);
//Define the Secure route for authenticated users
app.use('/api', passport.authenticate('jwt', { session : false }), secureRoute );
 //CORS
 
 app.use(cors());
/*
app.set('port', 1234);
var server = app.listen(app.get('port'), () => {
    console.log('Express server listening on port ' + server.address().port);
});*/

app.listen(1234);






//Set up the relationships between the tables
User.belongsTo(Role);
Movie.belongsToMany(Category, { through: MovieCategory });

//Database sync
  Sequelize.sync().then(()=>{
    Role.insert_default().then((adm)=>{
      User.insert_default(adm).then(()=>{
        Category.insert_default().then(()=>{
          Movie.insert_default().then(()=>{
           
            app.listen(80, function () {
             console.log('CORS-enabled web server listening on port 80');
            }); 
          })
        });     
    }); 
    });
  });
} //paranteza try
catch(e)
{
    console.log(e);
}