const router = require("express").Router();
const Empresa = require("../models/empresa")
const { Op } = require("sequelize");
const autenticarJWT = require("../middleware/autenticarJWT");
const { autorizarAcessoBackoffice, carregarUtilizador } = require("../middleware/autorizarAcesso");

router.use(autenticarJWT);
router.use(carregarUtilizador);

router.post("/inserir", autorizarAcessoBackoffice, async (req, res) => {
    try {
        const dados = req.body;
        await Empresa.create(dados);
        res.json("Registro criado com sucesso");
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

router.put("/atualizar/:id", autorizarAcessoBackoffice, async (req, res) => {
    try {
        const dados = req.body;
        const { id } = req.params;

        const result = await Empresa.update(dados, { where: { id: id } });

        if (result[0] === 0) {
            return res.status(404).json({ erro: "Registro não encontrado" });
        }
        res.json("Registro atualizado com sucesso");
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

router.delete("/apagar/:id", autorizarAcessoBackoffice, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Empresa.destroy({ where: { id: id } });

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
        const whereClause = req.user.superAdmin ? {} : { id: req.user.empresaId };
        const companies = await Empresa.findAll({ where: whereClause, order: [["id", "ASC"]] });
        res.json(companies);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

router.get("/listar/filtro", async (req, res) => {
    try {
        const { nome, nif, email, telefone } = req.query;
        const filtros = {};

        if (nome) filtros.nome = { [Op.like]: `%${nome}%` };
        if (nif) filtros.nif = { [Op.like]: `%${nif}%` };
        if (email) filtros.email = { [Op.like]: `%${email}%` };
        if (telefone) filtros.telefone = { [Op.like]: `%${telefone}%` };

        const companies = await Empresa.findAll({
            where: { ...filtros },
            order: [["id", "ASC"]]
        });

        res.json(companies);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

module.exports = router;
