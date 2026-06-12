const {
  TipoEcoponto,
  TipoDeposito,
  Deposito,
  Ecoponto,
  Equipamento,
  EcopontoEquipamento,
  Empresa,
  Utilizador,
  Cargo
} = require("./models/models");

const bcrypt = require("bcrypt");
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
      empresaId: 1,
      descricao: "apenas um ecoponto regular"
    },

    {
      capacidadeTotal: 5.0,
      altura: 2.0,
      tipoDepositoId: 2,
      empresaId: 1,
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
      empresaId: 1,
      capacidadeAtual: 2.0,
      latitude: 41.1622468,
      longitude: -8.6631531,
      descricao: "um vidrão superficial no Porto"
    },

    {
      codigo: "VX6FT",
      tipoEcopontoId: 2,
      depositoId: 1,
      empresaId: 1,
      capacidadeAtual: 2.2,
      latitude: 38.7441392,
      longitude: -9.2009353,
      descricao: "um embalão superficial em Lisboa"
    },

    {
      codigo: "VX7FT",
      tipoEcopontoId: 3,
      depositoId: 1,
      empresaId: 1,
      capacidadeAtual: 2.5,
      latitude: 40.4380986,
      longitude: -3.844343,
      descricao: "um papelão superficial em Madrid"
    },

    {
      codigo: "VX5FS",
      tipoEcopontoId: 1,
      depositoId: 2,
      empresaId: 1,
      latitude: 40.642346,
      longitude: -8.649730,
      descricao: "um vidrão subterrâneo em aveiro"
    },

    {
      codigo: "VX6FS",
      tipoEcopontoId: 2,
      depositoId: 2,
      empresaId: 1,
      latitude: 40.642346,
      longitude: -8.649730,
      descricao: "um embalão subterrâneo em aveiro"
    },

    {
      codigo: "VX7FS",
      tipoEcopontoId: 3,
      depositoId: 2,
      empresaId: 1,
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
      empresaId: 1,
      ativo: true
    },

    {
      codigo: "ARD002",
      empresaId: 1,
      ativo: true
    },

    {
      codigo: "ARD003",
      empresaId: 1,
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
      empresaId: 1
    },

    {
      equipamentoId: 2,
      ecopontoId: 2,
      empresaId: 1
    },

    {
      equipamentoId: 3,
      ecopontoId: 3,
      empresaId: 1
    }

  ]);

  await Cargo.bulkCreate([
    {
      cargo: "Super-Administrador"
    },

    {
      cargo: "Administrador"
    },

    {
      cargo: "Funcionário"
    }

  ]);

  await Empresa.bulkCreate([

    {
      nome: "Empresa 1",
      nif: "123456789",
      email: "empresa1@gmail.com",
      telefone: "912345678",
      latitude: 40.712776,
      longitude: -7.005974
    },
    {
      nome: "Empresa 2",
      nif: "987654321",
      email: "empresa2@gmail.com",
      telefone: "987654321",
      latitude: 41.902782,
      longitude: -6.496366
    }

  ]);

  await Utilizador.bulkCreate([

    {
      nome: "Super Admin",
      email: "teste@gmail.com",
      password: await bcrypt.hash("superadmin123", await bcrypt.genSalt(10)),
      cargoId: 1,
    }
  ]);


  console.log("Dados inseridos com sucesso!");




}

module.exports = { inserirDados };