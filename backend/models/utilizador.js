const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Utilizador = sequelize.define("Utilizador", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  cargoId: { type: DataTypes.INTEGER, allowNull: false },
  empresaId: { type: DataTypes.INTEGER, allowNull: true },
}, {
  tableName: "utilizador",
  timestamps: true
});


module.exports = Utilizador;
