const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const EcopontoLogs = sequelize.define("EcopontoLogs", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  codigoEcoponto: DataTypes.TEXT,
  codigoEquipamento: DataTypes.TEXT,
  detalhes: DataTypes.TEXT,
  data: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: "ecoponto_logs",
  timestamps: false
});

module.exports = EcopontoLogs;