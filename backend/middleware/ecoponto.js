const Joi = require("joi");

const createEcopontoSchema = Joi.object({
    id: Joi.any().forbidden(),
    codigo: Joi.string().uppercase().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    tipoEcopontoId: Joi.number().required(),
    depositoId: Joi.number().required(),
    empresaId: Joi.number().allow('', null).required(),
    capacidadeAtual: Joi.any().forbidden(),
    descricao: Joi.string().allow('', null).optional()

})

const updateEcopontoSchema = Joi.object({
    codigo: Joi.string().uppercase().optional(),
    latitude: Joi.number().precision(5).optional(),
    longitude: Joi.number().precision(5).optional(),
    capacidadeAtual: Joi.number().allow('', null).positive().precision(2).optional(),
    tipoEcopontoId: Joi.number().optional(),
    depositoId: Joi.number().optional(),
    empresaId: Joi.number().allow('', null).optional(),
    descricao: Joi.string().allow('', null).optional(),

})

module.exports = { createEcopontoSchema, updateEcopontoSchema }
