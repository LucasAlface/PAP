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
      nome: "Escola da Ponte",
      nif: "123456789",
      email: "empresa1@gmail.com",
      telefone: "912345678",
      latitude: 41.3491193,
      longitude: -8.4051847
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