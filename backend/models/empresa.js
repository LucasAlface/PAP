const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Empresa = sequelize.define("Empresa", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  nif: DataTypes.STRING,
  email: DataTypes.STRING,
  telefone: DataTypes.STRING,
  latitude: DataTypes.FLOAT,
  longitude: DataTypes.FLOAT
}, {
  tableName: "empresa",
  timestamps: true
});


module.exports = Empresa;