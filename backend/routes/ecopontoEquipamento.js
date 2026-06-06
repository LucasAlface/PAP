const router = require("express").Router();
const EcopontoEquipamento = require("../models/ecopontoEquipamento")
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
        console.log(req.body);
        const registro = await EcopontoEquipamento.create({
            ...req.body,
            empresaId
        });
        res.json("Registro criado com sucesso");
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

router.put("/atualizar/:idEcoponto/:idEquipamento", async (req, res) => {
    try {
        const dados = req.body;
        const { idEcoponto, idEquipamento } = req.params;
        const empresaId = setEmpresaId(req);
        const whereClause = whereEmpresa(req, { ecopontoId: idEcoponto, equipamentoId: idEquipamento });

        const result = await EcopontoEquipamento.update({ ...dados, empresaId }, { where: whereClause });

        if (result[0] === 0) {
            return res.status(404).json({ erro: "Registro não encontrado ou sem permissão" });
        }
        res.json("Registro atualizado com sucesso");
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

router.delete("/apagar/:idEcoponto/:idEquipamento", async (req, res) => {
    try {
        const { idEcoponto, idEquipamento } = req.params;
        const whereClause = whereEmpresa(req, { ecopontoId: idEcoponto, equipamentoId: idEquipamento });
        const result = await EcopontoEquipamento.destroy({ where: whereClause });

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
        const registros = await EcopontoEquipamento.findAll({ where: whereClause, order: [["ecopontoId", "ASC"], ["equipamentoId", "ASC"]] });
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

        const whereClause = whereEmpresa(req);
        const registros = await EcopontoEquipamento.findAll({
            where: { ...filtros, ...whereClause }
        });

        res.json(registros);

    } catch (err) {
        res.status(500).json({
            erro: err.message
        });
    }
});

module.exports = router;