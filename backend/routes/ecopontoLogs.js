const router = require("express").Router();
const EcopontoLogs = require("../models/ecopontoLogs");
const { Op } = require("sequelize");

router.post("/inserir", async (req, res) => {
    try {
        const dados = req.body;
        await EcopontoLogs.bulkCreate(dados);
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
        const logs = await EcopontoLogs.findAll({ order: [["id", "DESC"]] });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

router.get("/listar/filtro", async (req, res) => {
    try {
        const {
            ecopontoId,
            equipamentoId,
            detalhes,
            dataInicio,
            dataFim
        } = req.query;

        const filtros = {};

        if (ecopontoId)
            filtros.ecopontoId = ecopontoId;

        if (equipamentoId)
            filtros.equipamentoId = equipamentoId;

        if (detalhes) {
            filtros.detalhes = {
                [Op.like]: `%${detalhes}%`
            };
        }

        if (dataInicio || dataFim) {
            filtros.hora = {};

            if (dataInicio) {
                filtros.hora[Op.gte] = new Date(dataInicio);
            }

            if (dataFim) {
                filtros.hora[Op.lte] = new Date(dataFim);
            }
        }

        const logs = await EcopontoLogs.findAll({
            where: filtros,
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
