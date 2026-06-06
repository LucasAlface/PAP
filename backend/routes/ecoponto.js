const router = require("express").Router();
const Ecoponto = require("../models/ecoponto")
const Utilizador = require("../models/utilizador")
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
        const ecoponto = await Ecoponto.create({
            ...req.body,
            empresaId
        });
        res.json(ecoponto);

    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

router.put("/atualizar/:id", async (req, res) => {
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
            operadorCapacidade,
            empresaId,
            descricao
        } = req.query;

        const filtros = {};

        // Igual
        if (codigo) filtros.codigo = codigo;

        if (tipoEcopontoId)
            filtros.tipoEcopontoId = tipoEcopontoId;

        if (depositoId)
            filtros.depositoId = depositoId;

        if (empresaId)
            filtros.empresaId = empresaId;

        // Descrição contendo texto
        if (descricao) {
            filtros.descricao = {
                [Op.like]: `%${descricao}%`
            };
        }

        // Capacidade com operador
        if (capacidadeAtual) {

            switch (operadorCapacidade) {

                case "maior":
                    filtros.capacidadeAtual = {
                        [Op.gt]: capacidadeAtual
                    };
                    break;

                case "menor":
                    filtros.capacidadeAtual = {
                        [Op.lt]: capacidadeAtual
                    };
                    break;

                case "igual":
                default:
                    filtros.capacidadeAtual = {
                        [Op.eq]: capacidadeAtual
                    };
                    break;
                    
                case "maior_igual":
                    filtros.capacidadeAtual = {
                        [Op.gte]: capacidadeAtual
                    };
                    break;

                case "menor_igual":
                    filtros.capacidadeAtual = {
                        [Op.lte]: capacidadeAtual
                    };
                    break;
            }
        }
        const whereClause = whereEmpresa(req);
        const ecopontos = await Ecoponto.findAll({
            where: { ...filtros, ...whereClause }
        });

        res.json(ecopontos);

    } catch (err) {
        res.status(500).json({
            erro: err.message
        });
    }
});



module.exports = router;