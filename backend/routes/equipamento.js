const router = require("express").Router();
const Equipamento = require("../models/equipamento")
const { Op } = require("sequelize");
const autenticarJWT = require("../middleware/autenticarJWT");
const { autorizarAcessoBackoffice, carregarUtilizador } = require("../middleware/autorizarAcesso");
const {whereEmpresa, setEmpresaId} = require("../functions/functions");

router.use(autenticarJWT);
router.use(carregarUtilizador);
router.use(autorizarAcessoBackoffice);

router.post("/inserir", async (req, res) => {
    try {
        const empresaId = setEmpresaId(req);
        const equipamento = await Equipamento.create({
            ...req.body,
            empresaId
        });
        res.json("Registro criado com sucesso");
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

router.put("/atualizar/:id", async (req, res) => {
    try {
        const dados = req.body;
        const { id } = req.params;
        const whereClause = whereEmpresa(req, { id: id });
        const empresaId = setEmpresaId(req);

        const result = await Equipamento.update({ ...dados, empresaId }, { where: whereClause });

        if (result[0] === 0) {
            return res.status(404).json({ erro: "Registro não encontrado ou sem permissão" });
        }
        res.json("Registro atualizado com sucesso");
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

router.delete("/apagar/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const whereClause = whereEmpresa(req, { id: id });
        const result = await Equipamento.destroy({ where: whereClause });

        if (result === 0) {
            return res.status(404).json({ erro: "Registro não encontrado ou sem permissão" });
        }
        res.json("Registro deletado com sucesso");
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

router.get("/listar", async (req, res) => {
    try {
        const whereClause = whereEmpresa(req);
        const equipamentos = await Equipamento.findAll({ where: whereClause, order: [["id", "ASC"]] });
        res.json(equipamentos);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

router.get("/listar/filtro", async (req, res) => {
    try {
        const {
            codigo,
            ativo,
        } = req.query;

        const filtros = {};

        if (codigo) {
            filtros.codigo = codigo;
        }

        if (ativo !== undefined && ativo !== "") {
            filtros.ativo = ativo === "true";
        }

        const whereClause = whereEmpresa(req);
        const equipamentos = await Equipamento.findAll({
            where: { ...filtros, ...whereClause }
        });

        res.json(equipamentos);

    } catch (err) {
        res.status(500).json({
            erro: err.message
        });
    }
});

module.exports = router;