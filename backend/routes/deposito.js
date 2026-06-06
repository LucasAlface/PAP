const router = require("express").Router();
const Deposito = require("../models/deposito")
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
        const deposito = await Deposito.create({
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

        const result = await Deposito.update({ ...dados, empresaId }, { where: whereClause });

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
        const result = await Deposito.destroy({ where: whereClause });

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
        const depositos = await Deposito.findAll({ where: whereClause, order: [["id", "ASC"]] });
        res.json(depositos);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

router.get("/listar/filtro", async (req, res) => {
    try {
        const {
            tipoDepositoId,
            capacidadeTotal,
            operadorCapacidade,
            altura,
            operaadorAltura,
            descricao
        } = req.query;

        const filtros = {};

        if (tipoDepositoId)
            filtros.tipoDepositoId = tipoDepositoId;

        if (descricao) {
            filtros.descricao = {
                [Op.like]: `%${descricao}%`
            };
        }

        if (capacidadeTotal) {
            switch (operadorCapacidade) {
                case "maior":
                    filtros.capacidadeTotal = {
                        [Op.gt]: capacidadeTotal
                    };
                    break;

                case "menor":
                    filtros.capacidadeTotal = {
                        [Op.lt]: capacidadeTotal
                    };
                    break;

                case "igual":
                default:
                    filtros.capacidadeTotal = {
                        [Op.eq]: capacidadeTotal
                    };
                    break;
            }
        }

        if (altura) {
            switch (operaadorAltura) {
                case "maior":
                    filtros.altura = {
                        [Op.gt]: altura
                    };
                    break;

                case "menor":
                    filtros.altura = {
                        [Op.lt]: altura
                    };
                    break;

                case "igual":
                default:
                    filtros.altura = {
                        [Op.eq]: altura
                    };
                    break;
                case "maior_igual":
                    filtros.altura = {
                        [Op.gte]: altura
                    };
                    break;

                case "menor_igual":
                    filtros.altura = {
                        [Op.lte]: altura
                    };
                    break;
            }
        }

        const whereClause = whereEmpresa(req);
        const depositos = await Deposito.findAll({
            where: { ...filtros, ...whereClause }
        });

        res.json(depositos);

    } catch (err) {
        res.status(500).json({
            erro: err.message
        });
    }
});

module.exports = router;