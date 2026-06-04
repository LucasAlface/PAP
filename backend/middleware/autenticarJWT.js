const jwt = require("jsonwebtoken");
require("dotenv").config();

function autenticarJWT(req, res, next) {
    const token = req.cookies?.accessToken;

    if (!token) {
        return res.status(401).json({
            erro: "Não autenticado"
        });
    }

    try {
        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = payload;

        next();
    } catch (err) {
        return res.status(401).json({
            erro: "Token inválido ou expirado"
        });
    }
}

module.exports = autenticarJWT;