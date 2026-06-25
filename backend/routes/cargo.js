const router = require("express").Router();
const Cargo = require("../models/cargo")
const { Op } = require("sequelize");
const autenticarJWT = require("../middleware/autenticarJWT");
const { autorizarAcessoBackoffice, carregarUtilizador } = require("../middleware/autorizarAcesso");

router.use(autenticarJWT);
router.use(carregarUtilizador);
router.use(autorizarAcessoBackoffice);

router.get("/listar", async (req, res) => {
    const isSuperAdmin = req.user.superAdmin;
    try {
        const whereClause = isSuperAdmin ? {} : { id: { [Op.gt]: req.user.cargo } };
        const cargos = await Cargo.findAll({ order: [["id", "ASC"]], where: whereClause });
        res.json(cargos);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

module.exports = router;