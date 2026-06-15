const Joi = require("joi");

const createUtilizadorSchema = Joi.object({
    id: Joi.any().forbidden(),
    nome: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().min(6).required(),
    cargoId: Joi.number().required(),
    empresaId: Joi.number().allow('', null).optional()
})

const updateUtilizadorSchema = Joi.object({
    nome: Joi.string().optional(),
    email: Joi.string().optional(),
    password: Joi.string().min(6).allow('', null).optional(),
    cargoId: Joi.number().optional(),
    empresaId: Joi.number().allow('', null).optional()
})

module.exports = { createUtilizadorSchema, updateUtilizadorSchema }
