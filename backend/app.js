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

app.get("/table/:nometabela", async (req, res) => {
  try {
    const { nometabela } = req.params;
    const result = await pool.query(`SELECT * from ${nometabela}`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.post("/ecoponto", async (req, res) => {
  try {
    const { codigo, latitude, longitude, descricao, depositoId, tipoEcopontoId } = req.body;
    if (!codigo || latitude === undefined || longitude === undefined || !descricao || !depositoId || !tipoEcopontoId) {
      return res.status(400).json({ erro: "codigo, latitude, longitude, descricao, depositoId e tipoEcopontoId são obrigatórios" });
    }

    const sql = "INSERT INTO ecoponto (codigo, latitude, longitude, descricao, depositoId, tipoEcopontoId) VALUES ($1, $2, $3, $4, $5, $6)";
    await pool.query(sql, [codigo, latitude, longitude, descricao, depositoId, tipoEcopontoId]);

    res.json("Ecoponto criado com sucesso");
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.post("/capacidade", async (req, res) => {
  try {
    const { codigoEquipamento, profundidade } = req.body;

    const ecopontoData = await pool.query(`"Select * from vw_ecoponto_full where codigoEquipamento = $1"`, [codigoEquipamento]);
    if (ecopontoData.rows.length === 0) {
      return res.status(404).json({ erro: "Equipamento não encontrado ou sem ecoponto associado" });
    }

    const ecopontoId = ecopontoData.rows[0].id;
    const capacidadeTotal = ecopontoData.rows[0].capacidadeTotal;
    const alturaDeposito = ecopontoData.rows[0].alturaDeposito;

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