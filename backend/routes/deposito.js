const router = require("express").Router();
const Deposito = require("../models/deposito")
const { Op } = require("sequelize");

router.post("/inserir", async (req, res) => {
    try {
        const dados = req.body;
        await Deposito.bulkCreate(dados);
        res.json("Registro criado com sucesso");
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

router.put("/atualizar/:id", async (req, res) => {
    try {
        const dados = req.body;
        const { id } = req.params;

        const result = await Deposito.update(dados, { where: { id: id } });

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
        const result = await Deposito.destroy({ where: { id: id } });

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
        const depositos = await Deposito.findAll({ order: [["id", "ASC"]] });
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

        const depositos = await Deposito.findAll({
            where: filtros
        });

        res.json(depositos);

    } catch (err) {
        res.status(500).json({
            erro: err.message
        });
    }
});

module.exports = router;