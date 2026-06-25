const Utilizador = require("../models/utilizador");

async function carregarUtilizador(req, res, next) {
    try {
        const user = await Utilizador.findByPk(req.user.id);

        if (!user) {
            return res.status(401).json({
                erro: "Utilizador não encontrado"
            });
        }

        req.user = {
            id: user.id,
            cargo: user.cargoId,
            empresaId: user.empresaId,
            superAdmin: user.cargoId === 1 ? true : false
        };


        next();
    } catch (err) {
        res.status(500).json({
            erro: err.message
        });
    }
}

async function autorizarAcessoBackoffice(req, res, next) {
    try {
        if (!req.user || (req.user.cargo !== 1 && req.user.cargo !== 2)) {
            return res.status(403).json({ erro: "Acesso negado" });
        }
        next();
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}



module.exports = {
    autorizarAcessoBackoffice,
    carregarUtilizador
};
