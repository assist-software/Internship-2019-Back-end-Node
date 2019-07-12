const Sequelize = require('sequelize');
const Model = Sequelize.Model;

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

  class User extends Model {}
User.init({
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: Sequelize.STRING, allowNull: false, validate: { s: ["^[a-z]+$",'i'], notNull: true, notEmpty: true } },
  email: { type: Sequelize.STRING, allowNull: false, unique: true, validate: { isEmail: true, notNull: true} },
  passwordHash: { type: Sequelize.STRING, allowNull: false },
}, 
  { sequelize, modelName: 'user', timestamps: false });

module.exports=User;
