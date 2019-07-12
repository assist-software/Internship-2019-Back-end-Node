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

  class Role extends Model {}
Role.init({
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: Sequelize.STRING, allowNull: false, validate: { is: ["^[a-z]+$",'i'], notNull: true, notEmpty: true } },
  isAdmin: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }
},
   { sequelize, modelName: 'role',timestamps: false });

module.exports=Role;