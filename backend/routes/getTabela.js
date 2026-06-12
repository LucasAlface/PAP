const router = require("express").Router();
const {Equipamento, EcopontoEquipamento, Ecoponto, Deposito} = require("../models/models")
const {whereEmpresa} = require("../functions/functions");
const autenticarJWT = require("../middleware/autenticarJWT");
const { carregarUtilizador } = require("../middleware/autorizarAcesso");

//router.use(carregarUtilizador);
router.put("/capacidade", async (req, res) => {
  try {
    const { codigoEquipamento, profundidade } = req.body;

    console.log("Código do equipamento:", codigoEquipamento);

    const equipamento = await Equipamento.findOne({ where: { codigo: codigoEquipamento } });
    if (!equipamento) {
      return res.status(404).json({ erro: "Equipamento não encontrado" });
    }
    const equipamentoId = equipamento.id;
    console.log("ID do equipamento:", equipamentoId);

    const ecopontoEquipamento = await EcopontoEquipamento.findOne({ where: { equipamentoId: equipamentoId, ativo: true } });
    if (!ecopontoEquipamento) {
      return res.status(404).json({ erro: "Ecoponto associado ao equipamento não encontrado" });
    }
    const ecopontoId = ecopontoEquipamento.ecopontoId;

    const ecoponto = await Ecoponto.findByPk(ecopontoId);
    if (!ecoponto) {
      return res.status(404).json({ erro: "Ecoponto não encontrado" });
    }

    const deposito = await Deposito.findByPk(ecoponto.depositoId);
    if (!deposito) {
      return res.status(404).json({ erro: "Depósito associado ao ecoponto não encontrado" });
    }

    const capacidadeTotal = deposito.capacidadeTotal;
    const altura = deposito.altura;

    const percentagem = profundidade / 100 / altura;
    const capacidadeAtual = percentagem * capacidadeTotal;

    await ecoponto.update({ capacidadeAtual: capacidadeAtual }); 


    res.json("simmmm", ecoponto);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.get("/coordenadas", autenticarJWT, carregarUtilizador, async (req, res) => {
  try {
    const whereClause = whereEmpresa(req);
    const ecopontos = await Ecoponto.findAll({ where: whereClause, order: [["id", "ASC"]] });
    const ecopontosCheios = [];

    for (const ecoponto of ecopontos) {
      const deposito = await Deposito.findByPk(ecoponto.depositoId);

      if (!deposito) continue;

      const percentagem = ecoponto.capacidadeAtual / deposito.capacidadeTotal * 100;

      ecopontosCheios.push({
        codigo: ecoponto.codigo,
        percentagem: percentagem,
        latitude: ecoponto.latitude,
        longitude: ecoponto.longitude
      });
    }

    res.json(ecopontosCheios);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      erro: "Erro ao obter coordenadas"
    });
  }
});
module.exports = router;