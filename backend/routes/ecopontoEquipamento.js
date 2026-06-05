const router = require("express").Router();
const EcopontoEquipamento = require("../models/ecopontoEquipamento")
const { Op } = require("sequelize");
const autenticarJWT = require("../middleware/autenticarJWT");
const { autorizarAcessoBackoffice } = require("../middleware/autorizarAcesso");

router.use(autenticarJWT);
router.use(autorizarAcessoBackoffice);

router.post("/inserir", async (req, res) => {
    try {
        const dados = req.body;
        await EcopontoEquipamento.create(dados);
        res.json("Registro criado com sucesso");
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

router.put("/atualizar/:idEcoponto/:idEquipamento", async (req, res) => {
    try {
        const dados = req.body;
        const { idEcoponto, idEquipamento } = req.params;

        const result = await EcopontoEquipamento.update(dados, { where: { ecopontoId: idEcoponto, equipamentoId: idEquipamento } });

        if (result[0] === 0) {
            return res.status(404).json({ erro: "Registro não encontrado" });
        }
        res.json("Registro atualizado com sucesso");
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

router.delete("/apagar/:idEcoponto/:idEquipamento", async (req, res) => {
    try {
        const { idEcoponto, idEquipamento } = req.params;
        const result = await EcopontoEquipamento.destroy({ where: { ecopontoId: idEcoponto, equipamentoId: idEquipamento } });

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
        const registros = await EcopontoEquipamento.findAll({ order: [["ecopontoId", "ASC"], ["equipamentoId", "ASC"]] });
        res.json(registros);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

router.get("/listar/filtro", async (req, res) => {
    try {
        const {
            ecopontoId,
            equipamentoId,
            ativo
        } = req.query;

        const filtros = {};

        if (ecopontoId)
            filtros.ecopontoId = ecopontoId;

        if (equipamentoId)
            filtros.equipamentoId = equipamentoId;

        if (ativo !== undefined && ativo !== "") {
            filtros.ativo = ativo === "true";
        }

        const registros = await EcopontoEquipamento.findAll({
            where: filtros
        });

        res.json(registros);

    } catch (err) {
        res.status(500).json({
            erro: err.message
        });
    }
});

module.exports = router;