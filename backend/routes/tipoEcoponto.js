const router = require("express").Router();
const TipoEcoponto = require("../models/tipoEcoponto");
const { Op } = require("sequelize");
const autenticarJWT = require("../middleware/autenticarJWT");
const { autorizarAcessoBackoffice, carregarUtilizador } = require("../middleware/autorizarAcesso");
const {validarBody} = require("../middleware/validarBody")

router.use(autenticarJWT);
router.use(carregarUtilizador);
router.use(autorizarAcessoBackoffice);

router.get("/listar", async (req, res) => {
  try {
    const tipos = await TipoEcoponto.findAll({ order: [["id", "ASC"]] });
    res.json(tipos);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});


module.exports = router;
