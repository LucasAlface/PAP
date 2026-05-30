const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Cargo = sequelize.define("Cargo", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cargo: { type: DataTypes.STRING, allowNull: false },
}, {
  tableName: "cargo",
  timestamps: false
});


module.exports = Cargo;