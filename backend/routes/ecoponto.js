const router = require("express").Router();
const { Ecoponto, Deposito } = require("../models/models")
const { Op } = require("sequelize");
const autenticarJWT = require("../middleware/autenticarJWT");
const { autorizarAcessoBackoffice, carregarUtilizador } = require("../middleware/autorizarAcesso");
const {whereEmpresa, setEmpresaId} = require("../functions/functions");
const { createEcopontoSchema, updateEcopontoSchema } = require("../middleware/ecoponto");
const {validarBody} = require("../middleware/validarBody")

router.use(autenticarJWT);
router.use(carregarUtilizador);
router.use(autorizarAcessoBackoffice);

router.post("/inserir", validarBody(createEcopontoSchema), async (req, res) => {
    try {
        const empresaId = setEmpresaId(req);            
        const ecoponto = await Ecoponto.create({
            ...req.body,
            empresaId
        });
        res.json(ecoponto);

    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

router.put("/atualizar/:id", validarBody(updateEcopontoSchema), async (req, res) => {
    try {
        const empresaId = setEmpresaId(req);
        const whereClause = whereEmpresa(req, { id: req.params.id });
        const result = await Ecoponto.update({ ...req.body, empresaId }, { where: whereClause });
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
        const whereClause = whereEmpresa(req, { id: req.params.id });
        const result = await Ecoponto.destroy({ where: whereClause });

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
        const ecopontos = await Ecoponto.findAll({ where: whereClause, order: [["id", "ASC"]] });
        res.json(ecopontos);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

router.get("/listar/filtro", async (req, res) => {
    try {
        const {
            codigo,
            tipoEcopontoId,
            depositoId,
            capacidadeAtual,
            capacidadeAtualMin,
            capacidadeAtualMax,
            capacidadeTotalMin,
            capacidadeTotalMax,
            empresaId,
            descricao
        } = req.query;

        const filtros = {};
        const filtrosDeposito = {};

        if (codigo) filtros.codigo = codigo;

        if (tipoEcopontoId)
            filtros.tipoEcopontoId = tipoEcopontoId;

        if (depositoId)
            filtros.depositoId = depositoId;

        if (empresaId)
            filtros.empresaId = empresaId;

        if (descricao) {
            filtros.descricao = {
                [Op.like]: `%${descricao}%`
            };
        }

        if (capacidadeAtualMin || capacidadeAtualMax) {
            filtros.capacidadeAtual = {};

            if (capacidadeAtualMin) filtros.capacidadeAtual[Op.gte] = capacidadeAtualMin;
            if (capacidadeAtualMax) filtros.capacidadeAtual[Op.lte] = capacidadeAtualMax;
        } else if (capacidadeAtual) {
            filtros.capacidadeAtual = { [Op.eq]: capacidadeAtual };
        }

        if (capacidadeTotalMin || capacidadeTotalMax) {
            filtrosDeposito.capacidadeTotal = {};

            if (capacidadeTotalMin) filtrosDeposito.capacidadeTotal[Op.gte] = capacidadeTotalMin;
            if (capacidadeTotalMax) filtrosDeposito.capacidadeTotal[Op.lte] = capacidadeTotalMax;
        }

        const whereClause = whereEmpresa(req);
        const include = Object.keys(filtrosDeposito).length > 0
            ? [{
                model: Deposito,
                attributes: [],
                where: filtrosDeposito,
                required: true
            }]
            : [];

        const ecopontos = await Ecoponto.findAll({
            where: { ...filtros, ...whereClause },
            include,
            order: [["id", "ASC"]]
        });

        res.json(ecopontos);

    } catch (err) {
        res.status(500).json({
            erro: err.message
        });
    }
});



module.exports = router;
