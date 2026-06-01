const router = require('express').Router();
const { Op } = require("sequelize");
const bcrypt = require('bcrypt');
const Utilizador = require("../models/utilizador");

router.post("/", async (req, res) => {
    try {
        const { email, password } = req.body;

        const utilizador = await Utilizador.findOne({ where: { email: email } });

        if (!utilizador) {
            return res.status(404).json({ erro: "Utilizador não encontrado" });
        }

        const validPassword = await bcrypt.compare(password, utilizador.password);

        if (!validPassword) {
            return res.status(401).json({ erro: "Password incorreta" });
        }

        res.json({ message: "Login bem-sucedido", utilizador: utilizador });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

module.exports = router;