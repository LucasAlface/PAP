const Utilizador = require("../models/utilizador");

async function autorizarAcessoBackoffice(req, res, next) {
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

async function autorizarAcessoSuperAdmin(req, res, next) {
    try {
        const user = await Utilizador.findByPk(req.user.id);
        if (!user || user.cargoId !== 1) {
            req.superAdmin = false;
        } else {
            req.superAdmin = true;
        }

        req.user.cargo = user.cargoId;
        next();
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

module.exports = {
    autorizarAcessoBackoffice,
    autorizarAcessoSuperAdmin
};
