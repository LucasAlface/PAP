const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Ecoponto = sequelize.define("Ecoponto", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  codigo: { type: DataTypes.TEXT, unique: true },
  tipoEcopontoId: DataTypes.INTEGER,
  depositoId: DataTypes.INTEGER,
  empresaId: DataTypes.INTEGER,
  capacidadeAtual: DataTypes.FLOAT,
  latitude: DataTypes.DECIMAL,
  longitude: DataTypes.DECIMAL,
  descricao: DataTypes.TEXT,
}, {
  tableName: "ecoponto",
  timestamps: true
});


module.exports = Ecoponto;