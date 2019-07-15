const Sequelize = require('sequelize');
const Model=Sequelize.Model

const sequelize = new Sequelize('postgres', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres'
  });

const role = sequelize.define('role', {
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
sequelize.sync().then(() =>{ 
    return  role.findAll()
        .then(users=>{ console.log(typeof(users))
            if(isEmptyObject(users)){
                console.log("Database is empty and we need to create 2 roles")
                role.create({name: 'Admin', isAdmin: true})
                    .then(()=>console.log("Admin created successfully"))
                role.create({name: 'User', isAdmin: false})
                    .then(()=>console.log("User created successfully"))
        }
    })
})
module.exports=role