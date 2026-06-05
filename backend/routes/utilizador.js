const router = require("express").Router();
const Utilizador = require("../models/utilizador")
const { Op } = require("sequelize");
const bcrypt = require('bcrypt');
const autenticarJWT = require("../middleware/autenticarJWT");
const { autorizarAcessoBackoffice, autorizarAcessoSuperAdmin } = require("../middleware/autorizarAcesso");

router.use(autenticarJWT);
router.use(autorizarAcessoBackoffice);
router.use(autorizarAcessoSuperAdmin);

router.post("/inserir", async (req, res) => {
    try {
        const dados = req.body;
        if (dados.cargoId <= req.user.cargo) {
            return res.status(403).json({ erro: "Acesso negado" });
        }
        dados.password = await bcrypt.hash(dados.password, await bcrypt.genSalt(10));
        await Utilizador.create(dados);

        res.json("Registro criado com sucesso");
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

router.put("/atualizar/:id", async (req, res) => {
    try {
        const dados = req.body;
        if (dados.cargoId <= req.user.cargo) {
            return res.status(403).json({ erro: "Acesso negado" });
        }
        const { id } = req.params;
        if (dados.password) {
            const salt = await bcrypt.genSalt(10);
            dados.password = await bcrypt.hash(dados.password, salt);
        }

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
        const userToDelete = await Utilizador.findByPk(id);

        if (!userToDelete) {
            return res.status(404).json({ erro: "Registro não encontrado" });
        }
        if (userToDelete.cargoId <= req.user.cargo) {
            return res.status(403).json({ erro: "Acesso negado" });
        }
        const result = await Utilizador.destroy({ where: { id: id } });

        if (result === 0) {
            return res.status(404).json({ erro: "Registro não encontrado" });
        }
        res.json("Registro apagado com sucesso");
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}); 

router.get("/listar", async (req, res) => {
    const isSuperAdmin = req.superAdmin;
    try {
        const whereClause = isSuperAdmin ? {} : { cargoId: { [Op.gt]: req.user.cargo } };
        const utilizadores = await Utilizador.findAll({ order: [["id", "ASC"]] });
        res.json(utilizadores);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

module.exports = router;