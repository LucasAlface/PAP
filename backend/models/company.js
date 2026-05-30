const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Company = sequelize.define("Company", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  nif: DataTypes.STRING,
  email: DataTypes.STRING,
  telefone: DataTypes.STRING,
}, {
  tableName: "company",
  timestamps: true
});


module.exports = Company;