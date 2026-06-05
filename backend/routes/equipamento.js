const router = require("express").Router();
const Equipamento = require("../models/equipamento")
const { Op } = require("sequelize");
const autenticarJWT = require("../middleware/autenticarJWT");
const { autorizarAcessoBackoffice } = require("../middleware/autorizarAcesso");

router.use(autenticarJWT);
router.use(autorizarAcessoBackoffice);

router.post("/inserir", async (req, res) => {
    try {
        const dados = req.body;
        await Equipamento.create(dados);
        res.json("Registro criado com sucesso");
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

router.put("/atualizar/:id", async (req, res) => {
    try {
        const dados = req.body;
        const { id } = req.params;

        const result = await Equipamento.update(dados, { where: { id: id } });

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
        const result = await Equipamento.destroy({ where: { id: id } });

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
        const equipamentos = await Equipamento.findAll({ order: [["id", "ASC"]] });
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
            bateria,
            operadorBateria
        } = req.query;

        const filtros = {};

        if (codigo) {
            filtros.codigo = codigo;
        }

        if (ativo !== undefined && ativo !== "") {
            filtros.ativo = ativo === "true";
        }

        if (bateria) {
            switch (operadorBateria) {
                case "maior":
                    filtros.bateria = {
                        [Op.gt]: bateria
                    };
                    break;

                case "menor":
                    filtros.bateria = {
                        [Op.lt]: bateria
                    };
                    break;

                case "igual":
                default:
                    filtros.bateria = {
                        [Op.eq]: bateria
                    };
                    break;

                case "maior_igual":
                    filtros.bateria = {
                        [Op.gte]: bateria
                    };
                    break;

                case "menor_igual":
                    filtros.bateria = {
                        [Op.lte]: bateria
                    };
                    break;
            }
        }

        const equipamentos = await Equipamento.findAll({
            where: filtros
        });

        res.json(equipamentos);

    } catch (err) {
        res.status(500).json({
            erro: err.message
        });
    }
});

router.get("/total", async (req, res) => {
    try {
        const total = await Equipamento.count({ where: { ativo: true } });
        res.json({ total });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

module.exports = router;