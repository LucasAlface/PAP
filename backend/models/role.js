const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Role = sequelize.define("Role", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  role: { type: DataTypes.STRING, allowNull: false },
}, {
  tableName: "role",
  timestamps: false
});


module.exports = Role;