const Joi = require("joi");

const createEmpresaSchema = Joi.object({
    id: Joi.any().forbidden(),
    nome: Joi.string().required(),
    nif: Joi.string().length(9).required(),
    email: Joi.string().required(),
    telefone: Joi.string().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required()
})

const updateEmpresaSchema = Joi.object({
    nome: Joi.string().optional(),
    nif: Joi.string().length(9).optional(),
    email: Joi.string().optional(),
    telefone: Joi.string().optional(),
    latitude: Joi.number().optional(),
    longitude: Joi.number().optional()
})

module.exports = { createEmpresaSchema, updateEmpresaSchema }
