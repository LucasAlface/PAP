function whereEmpresa(req, extraWhere = {}) {
    if (req.user.superAdmin) {
        return extraWhere;
    }

    return {
        ...extraWhere,
        empresaId: req.user.empresaId
    };
}

module.exports = whereEmpresa;