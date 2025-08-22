"use strict";

const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql", // or 'postgres'
    logging: false,
  }
);

// Import models
const User = require("./user")(sequelize, DataTypes);
const Task = require("./task")(sequelize, DataTypes);

// Associations
User.associate({ Task });
Task.associate({ User });

module.exports = {
  sequelize, // the Sequelize instance
  User, // your User model
  Task, // your Task model
};
