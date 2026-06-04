const router = require("express").Router();
const Cargo = require("../models/cargo")
const { Op } = require("sequelize");
const autenticarJWT = require("../middleware/autenticarJWT");
const autorizarAcesso = require("../middleware/autorizarAcesso");

router.use(autenticarJWT);
router.use(autorizarAcesso);

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
    try {
        const cargos = await Cargo.findAll({ order: [["id", "ASC"]] });
        res.json(cargos);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

module.exports = router;