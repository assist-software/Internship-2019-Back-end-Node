const Sequelize = require('sequelize');
const Model=Sequelize.Model
const db=require("../db")


const role = db.define('role', {
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
        
        is: ["^[a-z]+$",'i'],
        
      }
    },
    isAdmin: {
      type: Sequelize.BOOLEAN,
      default: false,
      require: true
      // allowNull defaults to true
    }
})

function isEmptyObject(obj) {
    return !Object.keys(obj).length;
  }
role.insertDefaultRoles=async () =>{ 
  const allroles=await role.findAll()
      if(allroles.length==0)
      {
              console.log("-----------Database is empty and we need to create 2 roles")
              await role.create({name: 'Admin', isAdmin: true})
              console.log("------------------Admin created successfully")
              await role.create({name: 'User', isAdmin: false})
              console.log("-------------------User created successfully")
      }
}
module.exports=role