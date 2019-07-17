const Sequelize = require('sequelize');
const Model=Sequelize.Model
const model=require("./role")
const bcrypt=require("bcrypt")
const db=require("../db")
const modelRole=require("./role")

const user = db.define('user', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey:true
    },
    name: {
      type: Sequelize.STRING,
      validate:{
        
        is: ["^[a-z]+$",'i'],
      }
    },
    email:{
        type: Sequelize.STRING,
        require: true,
        unique: true,
        validate: {
            isEmail: true,
        }
    },
    passwordHash: {
      type: Sequelize.STRING,
      require: true
      
    },
})



function isEmptyObject(obj) {
    return !Object.keys(obj).length;
  }

user.beforeBulkUpdate((user) => {
    
    var user_pass=user.attributes
    console.log(user_pass)
    return bcrypt.hash(user_pass.passwordHash, 10)
        .then((hash) => {
            user_pass.passwordHash=hash
        })

        
});

user.beforeCreate((user) => {
    
    return bcrypt.hash(user.passwordHash, 10)
        .then(hash => {
            user.passwordHash = hash;
        })
        
});

user.insertDefaultUser=async () =>{ 
    const allusers=await user.findAll()
    if(allusers.length==0)
      {
              await user.create({name: 'Admin', email: 'admin@yahoo.com',passwordHash: 'admin',roleId: 1})
              console.log("Database is empty and we need to create a default user")
      }
    }
module.exports=user