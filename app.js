const Sequelize = require('sequelize');
const Role=require("./Models/role")
const User=require("./Models/user")

const sequelize = new Sequelize('WatchNext', 'postgres', 'teamY', {
  host: 'localhost',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});

User.sync({ force: true }).then(() => {
  User.create({
   name: 'user1',
   email: 'user1@assist.ro',
   passwordHash: 'user1'
 });
 User.create({
    name: 'admin',
    email: 'admin@assist.ro',
    passwordHash: 'admin'
  });
});

Role.sync({ force: true }).then(() => {
    Role.create({
     name: 'admin',
     isAdmin: true,
   });
   Role.create({
    name: 'user1',
    isAdmin: false,
  });
  });
  User.hasOne(Role);
  Role.belongsTo(User);

