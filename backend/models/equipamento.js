const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Equipamento = sequelize.define("Equipamento", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  empresaId: DataTypes.INTEGER,
  codigo: { type: DataTypes.TEXT, unique: true },
  ativo: { type: DataTypes.BOOLEAN, defaultValue: false },
  bateria: DataTypes.DECIMAL,
}, {
  tableName: "equipamento",
  timestamps: false
});

module.exports = Equipamento;