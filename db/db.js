const Sequelize = require('sequelize');

const Model = Sequelize.Model;


const db = new Sequelize('WatchNext' /*baza de date */, 'WatchNext' /*username admin */, 'roberto222122' /*password admin */, {
  host: 'localhost',
  dialect: 'postgres' /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql'  */

});

db.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })



module.exports= db;