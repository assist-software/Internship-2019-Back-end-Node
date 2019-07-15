const express =require("express")
const bodyParser=require("body-parser")
const passport=require("passport")
var routes=require('./routes/routes')
const app=express()
const port=3000
const pass=require('./authentication/authentication');
const Sequelize = require('sequelize');
const modelRole=require("./models/role")
const modelUser=require("./models/user")

const sequelize = new Sequelize('postgres', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres'
  });

  sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(passport.initialize())
app.use(passport.session())




app.use("/",routes)


app.listen(port,()=>console.log(`The app is listen on port ${port}`))