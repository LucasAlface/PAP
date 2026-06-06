const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Deposito = sequelize.define("Deposito", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  capacidadeTotal: DataTypes.FLOAT,
  altura: DataTypes.FLOAT,
  tipoDepositoId: DataTypes.INTEGER,
  empresaId: DataTypes.INTEGER,
  descricao: DataTypes.TEXT,
}, {
  tableName: "deposito",
  timestamps: false
});


module.exports = Deposito;