const User= require('./User');
const Sequelize= require('sequelize');
const db= require('../db/db');
const Model = Sequelize.Model;

/*
Role Model
{ 
  id: <autoincrement>, 
  name: <string, required, unique>, 
  isAdmin: <boolean, required, default: false> 
  }
*/


 class Role extends Model {
 }

 Role.init({
  // attributes
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  isAdmin: Sequelize.BOOLEAN,
}, {
    sequelize: db,
    modelName: 'Role'
  
  // options
}
);


Role.insert_default= async ()=>{

  
const empt = await Role.count().then((c)=>{return c});
//console.log('\n \n empt ', empt);
if(empt == 0 )
{
const adm= await Role.create({name: 'admin', isAdmin : true});
console.log('ADM ADM ADM \n ', adm);
Role.create({name: 'user', isAdmin: false});
return adm;
}else {
  console.log('\n *** ROLE ARE DEJA DEFAULT *** \n ');
}
}



module.exports = Role;