const Utilizador = require("../models/utilizador");

async function autorizarAcesso(req, res, next) {
    try {
        const user = await Utilizador.findByPk(req.user.id);

        if (!user || (user.cargoId !== 1 && user.cargoId !== 2)) {
            return res.status(403).json({ erro: "Acesso negado" });
        }

        next();
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

module.exports = autorizarAcesso;
