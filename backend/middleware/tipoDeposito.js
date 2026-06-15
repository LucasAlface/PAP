const Joi = require("joi");

const createTipoDepositoSchema = Joi.object({
    id: Joi.any().forbidden(),
    tipo: Joi.string().required(),
    descricao: Joi.string().allow('', null).optional()
})

const updateTipoDepositoSchema = Joi.object({
    tipo: Joi.string().optional(),
    descricao: Joi.string().allow('', null).optional()
})

module.exports = { createTipoDepositoSchema, updateTipoDepositoSchema }
