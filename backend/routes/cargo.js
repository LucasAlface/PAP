const router = require("express").Router();
const Cargo = require("../models/cargo")
const { Op } = require("sequelize");
const autenticarJWT = require("../middleware/autenticarJWT");
const { autorizarAcessoBackoffice, autorizarAcessoSuperAdmin } = require("../middleware/autorizarAcesso");

router.use(autenticarJWT);
router.use(autorizarAcessoBackoffice);
router.use(autorizarAcessoSuperAdmin);

router.post("/inserir", async (req, res) => {
    try {
        const dados = req.body;
        await Cargo.create(dados);
        res.json("Registro criado com sucesso");
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

router.put("/atualizar/:id", async (req, res) => {
    try {
        const dados = req.body;
        const { id } = req.params;

        const result = await Cargo.update(dados, { where: { id: id } });

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
        const result = await Cargo.destroy({ where: { id: id } });

        if (result === 0) {
            return res.status(404).json({ erro: "Registro não encontrado" });
        }
        res.json("Registro deletado com sucesso");
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

router.get("/listar", async (req, res) => {
    isSuperAdmin = req.superAdmin;
    try {
        whereClause = isSuperAdmin ? {} : { id: { [Op.gt]: req.user.cargo } };
        const cargos = await Cargo.findAll({ order: [["id", "ASC"]] });
        res.json(cargos);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

module.exports = router;