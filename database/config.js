const Sequelize = require("sequelize");

const sequelize = new Sequelize (
    
    process.env.DB_DATABASE, 
    process.env.DB_USER, 
    process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: "mysql",
        operatorsAliases: false,
    
        pool: {
        max: 5,     
        min: 0,     
        idle: 10000
        }

  });

  const db = {};
  db.Sequelize = Sequelize;
  db.sequelize = sequelize;
  //Registrar Modelos
  db.roles = require("../models/roles")(sequelize, Sequelize);
  db.access = require("../models/access")(sequelize, Sequelize);
  db.role_access = require("../models/role_access")(sequelize, Sequelize);
  db.users = require("../models/users")(sequelize, Sequelize);
  module.exports = db;