const router = require("express").Router();
const Utilizador = require("../models/utilizador")
const { Op } = require("sequelize");
const bcrypt = require('bcrypt');
const autenticarJWT = require("../middleware/autenticarJWT");
const { autorizarAcessoBackoffice, carregarUtilizador } = require("../middleware/autorizarAcesso");
const { whereEmpresa, setEmpresaId } = require("../functions/functions");

router.use(autenticarJWT);
router.use(carregarUtilizador);
router.use(autorizarAcessoBackoffice);

router.post("/inserir", async (req, res) => {
    try {
        const dados = req.body;
        const isSuperAdmin = req.user.superAdmin;
        const empresaId = setEmpresaId(req);

        if (!isSuperAdmin) {
            if (dados.cargoId <= req.user.cargo) {
                return res.status(403).json({ erro: "Acesso negado" });
            }
        }
        dados.password = await bcrypt.hash(dados.password, await bcrypt.genSalt(10));
        await Utilizador.create({ ...dados, empresaId });
    
        res.json("Registro criado com sucesso");
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

router.put("/atualizar/:id", async (req, res) => {
    try {
        const dados = req.body;
        const isSuperAdmin = req.user.superAdmin;
        const empresaId = setEmpresaId(req);
        if (!isSuperAdmin) {
            if (dados.cargoId <= req.user.cargo) {
                return res.status(403).json({ erro: "Acesso negado" });
            }
    }
        const { id } = req.params;
        if (dados.password) {
            const salt = await bcrypt.genSalt(10);
            dados.password = await bcrypt.hash(dados.password, salt);
        }
        const whereClause = whereEmpresa(req, { id: id });
        const result = await Utilizador.update({ ...dados, empresaId }, { where: whereClause });

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
        const isSuperAdmin = req.user.superAdmin;
        const userToDelete = await Utilizador.findByPk(id);

        if (!userToDelete) {
            return res.status(404).json({ erro: "Registro não encontrado" });
        }
        if (!isSuperAdmin) {
            if (userToDelete.cargoId <= req.user.cargo) {
                return res.status(403).json({ erro: "Acesso negado" });
            }
        }
        const whereClause = whereEmpresa(req, { id: id });
        const result = await Utilizador.destroy({ where: whereClause });

        if (result === 0) {
            return res.status(404).json({ erro: "Registro não encontrado" });
        }
        res.json("Registro apagado com sucesso");
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}); 

router.get("/listar", async (req, res) => {
    const isSuperAdmin = req.user.superAdmin;
    try {
        const whereClause = isSuperAdmin ? {} : whereEmpresa(req, { cargoId: { [Op.gt]: req.user.cargo } });
        const utilizadores = await Utilizador.findAll({ order: [["id", "ASC"]], where: whereClause });
        res.json(utilizadores);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

router.get("/listar/filtro", async (req, res) => {
    const isSuperAdmin = req.user.superAdmin;
    try {
        const { nome, email, cargoId, empresaId } = req.query;
        const filtros = {};

        if (nome) filtros.nome = { [Op.like]: `%${nome}%` };
        if (email) filtros.email = { [Op.like]: `%${email}%` };
        if (cargoId) filtros.cargoId = cargoId;
        if (empresaId) filtros.empresaId = empresaId;

        const whereClause = whereEmpresa(req);

        const utilizadores = await Utilizador.findAll({
            order: [["id", "ASC"]],
            where: { ...filtros, ...whereClause }
        });

        res.json(utilizadores);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

module.exports = router;
