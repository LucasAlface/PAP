const router = require('express').Router();
const { Op } = require("sequelize");
const bcrypt = require('bcrypt');
const Utilizador = require("../models/utilizador");
const jwt = require("jsonwebtoken");
const autenticarJWT = require("../middleware/autenticarJWT");
require("dotenv").config();


router.post("/", async (req, res) => {
    try {
        const { email, password } = req.body;

        const utilizador = await Utilizador.findOne({
            where: { email }
        });

        if (!utilizador) {
            return res.status(404).json({
                erro: "Utilizador não encontrado"
            });
        }

        const validPassword = await bcrypt.compare(
            password,
            utilizador.password
        );

        if (!validPassword) {
            return res.status(401).json({
                erro: "Password incorreta"
            });
        }

        const token = jwt.sign(
            {
                id: utilizador.id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 1000 // 1 hora
        });

        return res.sendStatus(200);

    } catch (err) {
        return res.status(500).json({
            erro: err.message
        });
    }
});

router.get("/me", autenticarJWT, async (req, res) => {
    try {
        const utilizador = await Utilizador.findByPk(req.user.id);

        if (!utilizador) {
            return res.status(404).json({
                erro: "Utilizador não encontrado"
            });
        }

        res.json({
            id: utilizador.id,
            nome: utilizador.nome,
            email: utilizador.email,
            cargo: utilizador.cargoId
        });
    } catch (err) {
        return res.status(500).json({
            erro: err.message
        });
    }
});
module.exports = router;