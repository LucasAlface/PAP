const router = require("express").Router();
const Utilizador = require("../models/utilizador")
const { Op } = require("sequelize");

router.post("/inserir", async (req, res) => {
    try {
        const dados = req.body;
        await Utilizador.bulkCreate(dados);
        res.json("Registro criado com sucesso");
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

router.put("/atualizar/:id", async (req, res) => {
    try {
        const dados = req.body;
        const { id } = req.params;

        const result = await Utilizador.update(dados, { where: { id: id } });

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
        const result = await Utilizador.destroy({ where: { id: id } });

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
        const utilizadores = await Utilizador.findAll({ order: [["id", "ASC"]] });
        res.json(utilizadores);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

module.exports = router;