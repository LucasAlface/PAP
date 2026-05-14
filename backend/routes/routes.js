const tipo_ecoponto_router = require("./tipoEcoponto")
const tipo_deposito_router = require("./tipoDeposito")
const deposito_router = require("./deposito")
const ecoponto_router = require("./ecoponto")
const equipamento_router = require("./equipamento")
const ecoponto_equipamento_router = require("./ecopontoEquipamento")
const rotas_router = require("./getTabela")

module.exports = {
  tipo_ecoponto_router,
  tipo_deposito_router,
  deposito_router,
  ecoponto_router,
  equipamento_router,
  ecoponto_equipamento_router,
  rotas_router
};