const router = require("express").Router();
const TipoEcoponto = require("../models/tipoEcoponto")

router.post("/inserir", async (req, res) => {
    const dados = req.body;
    await TipoEcoponto.bulkCreate(dados);
    res.json("Registro criado com sucesso");
});

module.exports = router;