function setEmpresaId(req) {
        if (req.user.superAdmin) {
            return req.body.empresaId
        } else {
            return req.user.empresaId;
        }
    } 
module.exports = setEmpresaId;