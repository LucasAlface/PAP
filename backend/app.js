const express = require("express");
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

app.get("/tipo_ecoponto", async (req, res) => {
  try {
    const result = await pool.query("SELECT * from tipo_ecoponto");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.get("/tipo_deposito", async (req, res) => {
  try {
    const result = await pool.query("SELECT * from tipo_deposito");
     res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.get("/deposito", async (req, res) => {
  try {
    const result = await pool.query("SELECT * from deposito");
     res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.get("/ecoponto", async (req, res) => {
  try {
    const result = await pool.query("SELECT * from ecoponto");
     res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.get("/equipamento", async (req, res) => {
  try {
    const result = await pool.query("SELECT * from equipamento");
     res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.get("/ecoponto_logs", async (req, res) => {
  try {
    const result = await pool.query("SELECT * from ecoponto_logs");
     res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.post("/capacidade", async (req, res) => {
  try {
    const { codigoEquipamento, profundidade } = req.body;
    if (!codigoEquipamento || profundidade === undefined) {
      return res.status(400).json({ erro: "codigoEquipamento e profundidade são obrigatórios" });
    }

    const equipamentoId = await pool.query("SELECT id FROM equipamento WHERE codigo = $1", [codigoEquipamento]);
    if (equipamentoId.rows.length === 0) {
      return res.status(404).json({ erro: "Equipamento não encontrado" });
    }
    console.log("Equipamento ID:", equipamentoId.rows[0].id);

    const ecopontoIdRows = await pool.query("SELECT ecopontoId AS \"ecopontoId\" FROM ecoponto_equipamento WHERE equipamentoId = $1 AND ativo = true", [equipamentoId.rows[0].id]);
    if (ecopontoIdRows.rows.length === 0) {
      return res.status(404).json({ erro: "Ecoponto associado ao equipamento não encontrado ou inativo" });
    }

    const ecopontoId = ecopontoIdRows.rows[0].ecopontoId;
    console.log("Ecoponto ID:", ecopontoId);

    const capacidadeTotal = await pool.query(`
      SELECT d.capacidadeTotal AS "capacidadeTotal"
      FROM deposito d
      JOIN ecoponto e ON d.id = e.depositoId
      WHERE e.id = $1
    `, [ecopontoId]);
    console.log("Capacidade Total:", capacidadeTotal.rows[0].capacidadeTotal);
    const altura = await pool.query("SELECT altura FROM deposito INNER JOIN ecoponto ON deposito.id = ecoponto.depositoId WHERE ecoponto.id = $1", [ecopontoId]);
    const percentagem = (profundidade / altura.rows[0].altura);
    const capacidadeAtual = (percentagem * capacidadeTotal.rows[0].capacidadeTotal).toFixed(2);

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