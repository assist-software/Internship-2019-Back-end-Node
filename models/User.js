const Sequelize= require('sequelize');
const db= require('../db/db');
const bcrypt = require('bcrypt');
var Role= require('./Role');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const Model = Sequelize.Model;
const nodeMailer = require('nodemailer');



/*
User Model
{
  id: <autoincrement>, 
  name: <string>, 
  email: <string, unique, required>, 
  passwordHash: <string, required>
  }
*/

class User extends Model{};


User.init({
    // attributes
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      //unique: true, 
    },
    fullName: {
      type: Sequelize.STRING,
     // allowNull: false,
      //unique: true, 
    },
    avatarUrl: {
      type: Sequelize.STRING,
     // allowNull: false,
    },
    email: {
        type: Sequelize.STRING, 
       unique: true,
       isEmail: true,
        primaryKey: true,
        allowNull: false
        // allowNull defaults to true
      }, 
      passwordHash: {
        type: Sequelize.STRING, 
        primaryKey: true,
        require: true,
        allowNull: false
      }, 
   
  }, {
      sequelize: db,
      modelName: 'User'
    // options
  }
  );


User.isValidPassword = async (password, user)=>{
 const actual= this;
 console.log('\n \n AM INTRAT IN IS VALID PASSWORD, AFISEZ THIS ', user);
  
  const compare = await bcrypt.compare(password, user.passwordHash);
  console.log('\n \n Functia isValidPassword returneaza  : ', compare.valueOf);
  return compare;

}     


User.insert_default= async (adm)=>{

  const empt = await User.count().then((c)=>{return c});
  if(empt==0)
  {
    const default_password= 'admin';
    const hash= await bcrypt.hash(default_password, 10);
    User.create({username: 'admin', email: 'admin', passwordHash: hash , RoleId: adm.id, fullName: 'admin', coverUrl: 'google.com'});
  }else {console.log('\n *** USER DEJA ARE DEFAULT *** \n ')}
}




  module.exports = User;

