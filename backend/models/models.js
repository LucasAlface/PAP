const { Sequelize } = require("sequelize");

const Equipamento = require("./equipamento")
const Ecoponto = require("./ecoponto")
const EcopontoLogs = require("./ecopontoLogs")
const Deposito = require("./deposito")
const TipoDeposito = require("./tipoDeposito")
const TipoEcoponto = require("./tipoEcoponto")
const EcopontoEquipamento = require("./ecopontoEquipamento")
const User = require("./user")
const Role = require("./role")
const Company = require("./company")

// Role -> User
Role.hasMany(User, { foreignKey: "roleId" });
User.belongsTo(Role, { foreignKey: "roleId" });
  
// Company -> User
Company.hasMany(User, { foreignKey: "companyId" });
User.belongsTo(Company, { foreignKey: "companyId" });

// Tipo Ecoponto -> Ecoponto
TipoEcoponto.hasMany(Ecoponto, { foreignKey: "tipoEcopontoId" });
Ecoponto.belongsTo(TipoEcoponto, { foreignKey: "tipoEcopontoId" });

// Tipo Deposito -> Deposito
TipoDeposito.hasMany(Deposito, { foreignKey: "tipoDepositoId" });
Deposito.belongsTo(TipoDeposito, { foreignKey: "tipoDepositoId" });

// Deposito -> Ecoponto
Deposito.hasMany(Ecoponto, { foreignKey: "depositoId" });
Ecoponto.belongsTo(Deposito, { foreignKey: "depositoId" });

// Ecoponto <-> Equipamento (N:N)
Ecoponto.belongsToMany(Equipamento, {
  through: EcopontoEquipamento,
  foreignKey: "ecopontoId"
});

Equipamento.belongsToMany(Ecoponto, {
  through: EcopontoEquipamento,
  foreignKey: "equipamentoId"
});


module.exports = {
  TipoEcoponto,
  TipoDeposito,
  Deposito,
  Ecoponto,
  Equipamento,
  EcopontoEquipamento,
  EcopontoLogs
};