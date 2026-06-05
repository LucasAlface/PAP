const router = require('express').Router();
const TipoDeposito = require('../models/tipoDeposito');
const { Op } = require("sequelize");
const autenticarJWT = require("../middleware/autenticarJWT");
const { autorizarAcessoBackoffice } = require("../middleware/autorizarAcesso");

router.use(autenticarJWT);
router.use(autorizarAcessoBackoffice);

router.post('/inserir', async (req, res) => {
  try {
    const dados = req.body;
    await TipoDeposito.create(dados);
    res.json('Registro criado com sucesso');
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.put('/atualizar/:id', async (req, res) => {
  try {
    const dados = req.body;
    const { id } = req.params;

    const result = await TipoDeposito.update(dados, { where: { id: id } });

    if (result[0] === 0) {
      return res.status(404).json({ erro: 'Registro não encontrado' });
    }
    res.json('Registro atualizado com sucesso');
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.delete('/apagar/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await TipoDeposito.destroy({ where: { id: id } });

    if (result === 0) {
      return res.status(404).json({ erro: 'Registro não encontrado' });
    }
    res.json('Registro deletado com sucesso');
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.get('/listar', async (req, res) => {
  try {
    const tipos = await TipoDeposito.findAll({ order: [['id', 'ASC']] });
    res.json(tipos);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.get('/listar/filtro', async (req, res) => {
  try {
    const {
      tipo,
      descricao
    } = req.query;

    const filtros = {};

    if (tipo) {
      filtros.tipo = {
        [Op.like]: `%${tipo}%`
      };
    }

    if (descricao) {
      filtros.descricao = {
        [Op.like]: `%${descricao}%`
      };
    }

    const tipos = await TipoDeposito.findAll({
      where: filtros
    });

    res.json(tipos);

  } catch (err) {
    res.status(500).json({
      erro: err.message
    });
  }
});

module.exports = router;