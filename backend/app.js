const express = require("express");
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, "../.env") });
const { TipoEcoponto, TipoDeposito, Deposito, Ecoponto, Equipamento, EcopontoEquipamento, EcopontoLogs } = require("./models/models");
const PORT = process.env.PORT || 3000;
const { inserirDados } = require("./script");
const tipo_ecoponto_router = require("./routes/tipoEcoponto")

const app = express();

app.use(express.json());

const tabelas = {
  "tipo_ecoponto": TipoEcoponto,
  "tipo_deposito": TipoDeposito,
  "deposito": Deposito,
  "ecoponto": Ecoponto,
  "equipamento": Equipamento,
  "ecoponto_equipamento": EcopontoEquipamento,
  "ecoponto_logs": EcopontoLogs
}

app.get("/", async (req, res) => {
  try {
    await inserirDados();
    res.json("online");
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.use("/tipoecoponto", tipo_ecoponto_router);

app.post("/inserir/:nometabela", async (req, res) => {
  try {
    const dados = req.body;
    const { nometabela } = req.params;

    const tabela = tabelas[nometabela];~
    console.log(tabela);
    if (!tabela) {
      return res.status(400).json({ erro: "Tabela inválida" });
    }
    await tabela.bulkCreate(dados);
    res.json("Registro criado com sucesso");
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.put("/atualizar/:nometabela/:id", async (req, res) => {
  try {
    const dados = req.body;
    const { nometabela, id } = req.params;

    const tabela = tabelas[nometabela];
    if (!tabela) {
      return res.status(400).json({ erro: "Tabela inválida" });
    }
    const result = await tabela.update(dados, { where: { id: id } });

    if (result[0] === 0) {
      return res.status(404).json({ erro: "Registro não encontrado" });
    }

    res.json("Registro atualizado com sucesso");
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.put("/atualizar/:nometabela/:id1/:id2", async (req, res) => {
  try {
    const dados = req.body;
    const { nometabela, id1, id2 } = req.params;

    const tabela = tabelas[nometabela];
    if (!tabela) {
      return res.status(400).json({ erro: "Tabela inválida" });
    }
    const result = await tabela.update(dados, { where: { ecopontoId: id1, equipamentoId: id2 } });

    if (result[0] === 0) {
      return res.status(404).json({ erro: "Registro não encontrado" });
    }

    res.json("Registro atualizado com sucesso " + result.rowCount + " colunas afetadas");
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.delete("/apagar/:nometabela/:id", async (req, res) => {
  try {
    const { nometabela, id } = req.params;

    const tabela = tabelas[nometabela];
    if (!tabela) {
      return res.status(400).json({ erro: "Tabela inválida" });
    }
   
    await tabela.destroy({ where: { id: id } });

    res.json("Registro apagado com sucesso");
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.delete("/apagar/:nometabela/:id1/:id2", async (req, res) => {
  try {
    const { nometabela, id1, id2 } = req.params;

    const tabela = tabelas[nometabela];
    if (!tabela) {
      return res.status(400).json({ erro: "Tabela inválida" });
    }
    
    await tabela.destroy({ where: { ecopontoId: id1, equipamentoId: id2 } });

    res.json("Registro apagado com sucesso");
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.put("/capacidade", async (req, res) => {
  try {
    const { codigoEquipamento, profundidade } = req.body;

    const equipamento = await Equipamento.findOne({ where: { codigo: codigoEquipamento } });
    if (!equipamento) {
      return res.status(404).json({ erro: "Equipamento não encontrado" });
    }
    const equipamentoId = equipamento.id;

    const ecopontoEquipamento = await EcopontoEquipamento.findOne({ where: { equipamentoId: equipamentoId, ativo: true } });
    if (!ecopontoEquipamento) {
      return res.status(404).json({ erro: "Ecoponto associado ao equipamento não encontrado" });
    }
    const ecopontoId = ecopontoEquipamento.ecopontoId;

    const ecoponto = await Ecoponto.findByPk(ecopontoId);
    if (!ecoponto) {
      return res.status(404).json({ erro: "Ecoponto não encontrado" });
    }

    const deposito = await Deposito.findByPk(ecoponto.depositoId);
    if (!deposito) {
      return res.status(404).json({ erro: "Depósito associado ao ecoponto não encontrado" });
    }

    const capacidadeTotal = deposito.capacidadeTotal;
    const altura = deposito.altura;

    const percentagem = profundidade / altura;
    const capacidadeAtual = percentagem * capacidadeTotal;

    await ecoponto.update({ capacidadeAtual: capacidadeAtual }); 


    res.json("simmmm");
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.listen(PORT, () => {
  console.log("Servidor online");
});