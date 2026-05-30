const tipo_ecoponto_router = require("./tipoEcoponto")
const tipo_deposito_router = require("./tipoDeposito")
const deposito_router = require("./deposito")
const ecoponto_router = require("./ecoponto")
const equipamento_router = require("./equipamento")
const ecoponto_equipamento_router = require("./ecopontoEquipamento")
const ecoponto_logs_router = require("./ecopontoLogs")
const rotas_router = require("./getTabela")
const utilizador_router = require("./utilizador")
const cargo_router = require("./cargo")
const empresa_router = require("./empresa")

module.exports = {
  tipo_ecoponto_router,
  tipo_deposito_router,
  deposito_router,
  ecoponto_router,
  equipamento_router,
  ecoponto_equipamento_router,
  ecoponto_logs_router,
  rotas_router, 
  utilizador_router,
  cargo_router,
  empresa_router
};