const router = require("express").Router();
const EcopontoLogs = require("../models/ecopontoLogs");
const { Op } = require("sequelize");
const autenticarJWT = require("../middleware/autenticarJWT");
const { autorizarAcessoBackoffice, carregarUtilizador } = require("../middleware/autorizarAcesso");
const { whereEmpresaEcopontoLogs } = require("../functions/functions");

router.use(autenticarJWT);
router.use(carregarUtilizador);
router.use(autorizarAcessoBackoffice);

router.post("/inserir", async (req, res) => {
    try {
        const dados = req.body;
        await EcopontoLogs.create(dados);
        res.json("Registro criado com sucesso");
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

router.delete("/apagar/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await EcopontoLogs.destroy({ where: { id: id } });

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
        const whereClause = await whereEmpresaEcopontoLogs(req);
        const logs = await EcopontoLogs.findAll({
            where: whereClause,
            order: [["id", "DESC"]]
        });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

router.get("/listar/filtro", async (req, res) => {
    try {
        const {
            codigoEcoponto,
            codigoEquipamento,
            detalhes,
            dataInicio,
            dataFim
        } = req.query;

        const filtros = {};

        if (codigoEcoponto)
            filtros.codigoEcoponto = codigoEcoponto;

        if (codigoEquipamento)
            filtros.codigoEquipamento = codigoEquipamento;

        if (detalhes) {
            filtros.detalhes = {
                [Op.like]: `%${detalhes}%`
            };
        }

        if (dataInicio || dataFim) {
            filtros.data = {};

            if (dataInicio) {
                filtros.data[Op.gte] = new Date(dataInicio);
            }

            if (dataFim) {
                const dataFimCompleta = new Date(dataFim);
                dataFimCompleta.setHours(23, 59, 59, 999);
                filtros.data[Op.lte] = dataFimCompleta;
            }
        }

        const whereClause = await whereEmpresaEcopontoLogs(req, filtros);
        const logs = await EcopontoLogs.findAll({
            where: whereClause,
            order: [["id", "DESC"]]
        });

        res.json(logs);

    } catch (err) {
        res.status(500).json({
            erro: err.message
        });
    }
});

module.exports = router;
