const Sequelize = require('sequelize');
const Model=Sequelize.Model
const modelRole=require("./role")
const bcrypt=require("bcrypt")
//const role=require('')


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

},{freezeTableName: true,})

//

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

function isEmptyObject(obj) {
    return !Object.keys(obj).length;
  }
  sequelize.sync().then(() =>{ 
      user.findAll()
        .then((users)=>{ console.log(typeof(users))
            if(isEmptyObject(users)){
                console.log("Database is empty and we need to create a default user")
                user.create({name: 'Admin', email: 'admin@yahoo.com',passwordHash: 'admin'})
                    .then(()=>console.log("Admin created successfully"))
                
        }
    })
}
 )

 modelRole.findAll()
      .then((users)=>{ 
        user.findAll()
                 .then((use)=>{
                  if(!isEmptyObject(use))
                  user.hasOne(modelRole,{foreignKey: 'id'})
                 })
                 } )

//user.comparePass


//*/)
module.exports=user