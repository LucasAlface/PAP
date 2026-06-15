const Joi = require("joi");

const createTipoEcopontoSchema = Joi.object({
    id: Joi.any().forbidden(),
    tipo: Joi.string().required(),
    descricao: Joi.string().allow('', null).optional()
})

const updateTipoEcopontoSchema = Joi.object({
    tipo: Joi.string().optional(),
    descricao: Joi.string().allow('', null).optional()
})

module.exports = { createTipoEcopontoSchema, updateTipoEcopontoSchema }
