const router = require("express").Router();
const TipoEcoponto = require("../models/tipoEcoponto");

router.post("/inserir", async (req, res) => {
  try {
    const dados = req.body;
    await TipoEcoponto.bulkCreate(dados);
    res.json("Registro criado com sucesso");
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.put("/atualizar/:id", async (req, res) => {
  try {
    const dados = req.body;
    const { id } = req.params;

    const result = await TipoEcoponto.update(dados, { where: { id: id } });

    if (result[0] === 0) {
      return res.status(404).json({ erro: "Registro não encontrado" });
    }
    res.json("Registro atualizado com sucesso");
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.delete("/apagar/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await TipoEcoponto.destroy({ where: { id: id } });

    if (result === 0) {
      return res.status(404).json({ erro: "Registro não encontrado" });
    }
    res.json("Registro deletado com sucesso");
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.get("/listar", async (req, res) => {
  try {
    const tipos = await TipoEcoponto.findAll({ order: [["id", "ASC"]] });
    res.json(tipos);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;