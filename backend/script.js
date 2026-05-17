const {
  TipoEcoponto,
  TipoDeposito,
  Deposito,
  Ecoponto,
  Equipamento,
  EcopontoEquipamento
} = require("./models/models");

const sequelize = require("./db");


async function inserirDados() {

  await sequelize.sync({ force: true });

  /* =========================
     TIPO ECOPONTO
  ========================= */

  await TipoEcoponto.bulkCreate([
    { tipo: "verde" },
    { tipo: "amarelo" },
    { tipo: "azul" }
  ]);


  /* =========================
     TIPO DEPOSITO
  ========================= */

  await TipoDeposito.bulkCreate([
    { tipo: "superficie" },
    { tipo: "subterraneo" }
  ]);


  /* =========================
     DEPOSITO
  ========================= */

  await Deposito.bulkCreate([
    {
      capacidadeTotal: 2.5,
      altura: 1.0,
      tipoDepositoId: 1,
      descricao: "apenas um ecoponto regular"
    },

    {
      capacidadeTotal: 5.0,
      altura: 2.0,
      tipoDepositoId: 2,
      descricao: "subterraneo grande e tal ya"
    }
  ]);


  /* =========================
     ECOPONTOS
  ========================= */

  await Ecoponto.bulkCreate([

    {
      codigo: "VX5FT",
      tipoEcopontoId: 1,
      depositoId: 1,
      capacidadeAtual: 2.0,
      latitude: 41.1622468,
      longitude: -8.6631531,
      descricao: "um vidrão superficial no Porto"
    },

    {
      codigo: "VX6FT",
      tipoEcopontoId: 2,
      depositoId: 1,
      capacidadeAtual: 2.2,
      latitude: 38.7441392,
      longitude: -9.2009353,
      descricao: "um embalão superficial em Lisboa"
    },

    {
      codigo: "VX7FT",
      tipoEcopontoId: 3,
      depositoId: 1,
      capacidadeAtual: 2.5,
      latitude: 40.4380986,
      longitude: -3.844343,
      descricao: "um papelão superficial em Madrid"
    },

    {
      codigo: "VX5FS",
      tipoEcopontoId: 1,
      depositoId: 2,
      latitude: 40.642346,
      longitude: -8.649730,
      descricao: "um vidrão subterrâneo em aveiro"
    },

    {
      codigo: "VX6FS",
      tipoEcopontoId: 2,
      depositoId: 2,
      latitude: 40.642346,
      longitude: -8.649730,
      descricao: "um embalão subterrâneo em aveiro"
    },

    {
      codigo: "VX7FS",
      tipoEcopontoId: 3,
      depositoId: 2,
      latitude: 40.642346,
      longitude: -8.649730,
      descricao: "um papelão subterrâneo em aveiro"
    }

  ]);


  /* =========================
     EQUIPAMENTOS
  ========================= */

  await Equipamento.bulkCreate([

    {
      codigo: "ARD001",
      ativo: true
    },

    {
      codigo: "ARD002",
      ativo: true
    },

    {
      codigo: "ARD003",
      ativo: true
    }

  ]);


  /* =========================
     ECOPONTO_EQUIPAMENTO
  ========================= */

  await EcopontoEquipamento.bulkCreate([

    {
      equipamentoId: 1,
      ecopontoId: 1,
    },

    {
      equipamentoId: 2,
      ecopontoId: 2,
    },

    {
      equipamentoId: 3,
      ecopontoId: 3,
    }

  ]);



  console.log("Dados inseridos com sucesso!");
}


module.exports = { inserirDados };