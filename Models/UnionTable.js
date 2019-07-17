const Sequelize = require('sequelize');
const Model=Sequelize.Model
const db=require("../db")

const UnionTable=db.define('UnionTable',{})

module.exports=UnionTable