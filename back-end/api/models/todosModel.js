const { Sequelize, Model, DataTypes } = require('sequelize');
const dbConfig = require("../../config/db");

console.log(dbConfig.database);

const sequelize = new Sequelize(dbConfig.database);

class Todos extends Model {}

Todos.init({
  stato: DataTypes.STRING,
  task: DataTypes.STRING,
  owner: DataTypes.STRING,
  scadenza: DataTypes.STRING,
  prio: DataTypes.STRING
}, { sequelize, modelName: 'todos' });

sequelize.sync();


console.log("init model");
module.exports = Todos;
