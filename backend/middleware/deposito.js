const Joi = require("joi");

const createDepositoSchema = Joi.object({
    id: Joi.any().forbidden(),
    capacidadeTotal: Joi.number().required(),
    altura: Joi.number().precision(1).required(),
    tipoDepositoId: Joi.number().required(),
    empresaId: Joi.number().allow('', null).optional(),
    descricao: Joi.string().allow('', null).optional()
})

const updateDepositoSchema = Joi.object({
    capacidadeTotal: Joi.number().allow('', null).optional(),
    altura: Joi.number().precision(1).allow('', null).optional(),
    tipoDepositoId: Joi.number().allow('', null).optional(),
    empresaId: Joi.number().allow('', null).optional(),
    descricao: Joi.string().allow('', null).optional()
})

module.exports = { createDepositoSchema, updateDepositoSchema }
