const router = require("express").Router();
const Equipamento = require("../models/equipamento")

router.post("/inserir", async (req, res) => {
    try {
        const dados = req.body;
        await Equipamento.bulkCreate(dados);
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

router.get("/total", async (req, res) => {
    try {
        const total = await Equipamento.count({ where: { ativo: true } });
        res.json({ total });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

module.exports = router;