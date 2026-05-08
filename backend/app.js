const express = require("express");
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, "../.env") });
const pool = require("./db");
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());


app.get("/", async (req, res) => {
  try {
    res.json("online");
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.get("/tabela/:nometabela", async (req, res) => {
  try {
    const { nometabela } = req.params;
    const result = await pool.query(`SELECT * from ${nometabela}`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.post("/inserir/:tabela", async (req, res) => {
  try {
    const dados = req.body;
    const { tabela } = req.params;

    const tabelasValidas = ["ecoponto", "tipo_ecoponto", "deposito", "tipo_deposito", "equipamento", "ecoponto_equipamento", "ecoponto_logs"];
    if (!tabelasValidas.includes(tabela)) {
      return res.status(400).json({ erro: "Tabela inválida" });
    }
    const colunas = Object.keys(dados).join(", ");
    const valores = Object.values(dados);
    const placeholders = valores.map((_, index) => `$${index + 1}`).join(", ");

    const sql = `INSERT INTO ${tabela} (${colunas}) VALUES (${placeholders})`;
    await pool.query(sql, valores);

    res.json("Registro criado com sucesso");
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.post("/atualizar/:tabela/:id", async (req, res) => {
  try {
    const dados = req.body;
    const { tabela, id } = req.params;

    const tabelasValidas = ["ecoponto", "tipo_ecoponto", "deposito", "tipo_deposito", "equipamento", "ecoponto_equipamento", "ecoponto_logs"];
    if (!tabelasValidas.includes(tabela)) {
      return res.status(400).json({ erro: "Tabela inválida" });
    }
    const colunas = Object.keys(dados);
    const valores = Object.values(dados);
    const setQuery = colunas
      .map((coluna, index) => `${coluna} = $${index + 1}`)
      .join(", ");

    const sql = `UPDATE ${tabela} SET ${setQuery} WHERE id = $${valores.length + 1}`;

    console.log(sql, [...valores, id]);

    await pool.query(sql, [...valores, id]);

    res.json("Registro atualizado com sucesso");
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});
app.post("/apagar/:tabela/:id", async (req, res) => {
  try {
    const { tabela, id } = req.params;

    const tabelasValidas = ["ecoponto", "tipo_ecoponto", "deposito", "tipo_deposito", "equipamento", "ecoponto_equipamento", "ecoponto_logs"];
    if (!tabelasValidas.includes(tabela)) {
      return res.status(400).json({ erro: "Tabela inválida" });
    }
    const sql = `DELETE FROM ${tabela} WHERE id = ${id}`;

    await pool.query(sql);

    res.json("Registro apagado com sucesso");
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.post("/capacidade", async (req, res) => {
  try {
    const { codigoEquipamento, profundidade } = req.body;

    const ecopontoData = await pool.query("Select * from vw_ecoponto_full where codigoEquipamento = $1", [codigoEquipamento]);
    if (ecopontoData.rows.length === 0) {
      return res.status(404).json({ erro: "Equipamento não encontrado ou sem ecoponto associado" });
    }

    const ecopontoId = ecopontoData.rows[0].id;
    const capacidadeTotal = ecopontoData.rows[0].capacidadetotal;
    const alturaDeposito = ecopontoData.rows[0].alturadeposito;

    const percentagem = (profundidade / alturaDeposito);
    const capacidadeAtual = (percentagem * capacidadeTotal).toFixed(2);

    const sql = "UPDATE ecoponto SET capacidadeAtual = $1 WHERE id = $2";
    await pool.query(sql, [capacidadeAtual, ecopontoId]);

    res.json("simmmm");
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.listen(PORT, () => {
  console.log("Servidor online");
});