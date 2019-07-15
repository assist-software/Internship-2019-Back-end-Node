const Sequelize = require('sequelize');
const Model=Sequelize.Model
const model=require("./role")
const bcrypt=require("bcrypt")
const sequelize = new Sequelize('postgres', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres'
  });

const user = sequelize.define('user', {
    // attributes
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

    /*instanceMethods:{

        validPassword:function(password){
            return bcrypt.compare(password,this.password)
        }
    
    }*/
})

user.hasOne(model,{foreignKey: 'id'})

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

//user.comparePass

sequelize.sync().then(() =>{ 
    return  user.findAll()
        .then(users=>{ console.log(typeof(users))
            if(isEmptyObject(users)){
                console.log("Database is empty and we need to create a default user")
                user.create({name: 'Admin', email: 'admin@yahoo.com',passwordHash: 'admin'})
                    .then(()=>console.log("Admin created successfully"))
                
        }
    })
})
module.exports=user