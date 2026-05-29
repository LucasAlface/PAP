const router = require("express").Router();
const Ecoponto = require("../models/ecoponto")
const { Op } = require("sequelize");

router.post("/inserir", async (req, res) => {
    try {
        const dados = req.body;
        await Ecoponto.bulkCreate(dados);
        res.json("Registro criado com sucesso");
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

router.put("/atualizar/:id", async (req, res) => {
    try {
        const dados = req.body;
        const { id } = req.params;

        const result = await Ecoponto.update(dados, { where: { id: id } });

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
        const result = await Ecoponto.destroy({ where: { id: id } });

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
        const ecopontos = await Ecoponto.findAll({ order: [["id", "ASC"]] });
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
            descricao
        } = req.query;

        const filtros = {};

        // Igual
        if (codigo) filtros.codigo = codigo;

        if (tipoEcopontoId)
            filtros.tipoEcopontoId = tipoEcopontoId;

        if (depositoId)
            filtros.depositoId = depositoId;

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

        const ecopontos = await Ecoponto.findAll({
            where: filtros
        });

        res.json(ecopontos);

    } catch (err) {
        res.status(500).json({
            erro: err.message
        });
    }
});



module.exports = router;