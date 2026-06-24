const { Op } = require("sequelize");
const Ecoponto = require("../models/ecoponto");
const Equipamento = require("../models/equipamento");

async function buscarCodigos(model, empresaId) {
    const registros = await model.findAll({
        attributes: ["codigo"],
        where: { empresaId: empresaId },
        raw: true
    });

    return registros.map((registro) => registro.codigo).filter(Boolean);
}

async function whereEmpresaEcopontoLogs(req, extraWhere = {}) {
    if (req.user.superAdmin) {
        return extraWhere;
    }

    const [codigosEcoponto, codigosEquipamento] = await Promise.all([
        buscarCodigos(Ecoponto, req.user.empresaId),
        buscarCodigos(Equipamento, req.user.empresaId)
    ]);

    const filtrosEmpresa = [];

    if (codigosEcoponto.length > 0) {
        filtrosEmpresa.push({ codigoEcoponto: { [Op.in]: codigosEcoponto } });
    }

    if (codigosEquipamento.length > 0) {
        filtrosEmpresa.push({ codigoEquipamento: { [Op.in]: codigosEquipamento } });
    }

    if (filtrosEmpresa.length === 0) {
        return {
            [Op.and]: [
                extraWhere,
                { id: { [Op.is]: null } }
            ]
        };
    }

    return {
        [Op.and]: [
            extraWhere,
            { [Op.or]: filtrosEmpresa }
        ]
    };
}

module.exports = whereEmpresaEcopontoLogs;
