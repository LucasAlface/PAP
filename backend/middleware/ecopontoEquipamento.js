const Joi = require("joi");

const createEcopontoEquipamentoSchema = Joi.object({
    ecopontoId: Joi.number().required(),
    equipamentoId: Joi.number().required(),
    empresaId: Joi.number().allow('', null).optional(),
    ativo: Joi.boolean().optional()
})

const updateEcopontoEquipamentoSchema = Joi.object({
    empresaId: Joi.number().allow('', null).optional(),
    ativo: Joi.boolean().optional()
})

module.exports = { createEcopontoEquipamentoSchema, updateEcopontoEquipamentoSchema }
