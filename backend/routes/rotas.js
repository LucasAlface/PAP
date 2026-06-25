const router = require("express").Router();
const {Equipamento, EcopontoEquipamento, Ecoponto, Deposito, TipoDeposito, EcopontoLogs} = require("../models/models")
const {whereEmpresa} = require("../functions/functions");
const autenticarJWT = require("../middleware/autenticarJWT");
const { carregarUtilizador } = require("../middleware/autorizarAcesso");

router.put("/capacidade", async (req, res) => {
  try {
    const { codigoEquipamento, profundidade } = req.body;

    const equipamento = await Equipamento.findOne({ where: { codigo: codigoEquipamento } });
    if (!equipamento) {
      const erro = `O equipamento ${codigoEquipamento} não está registado`;
      await EcopontoLogs.create({
        codigoEquipamento: codigoEquipamento,
        detalhes: erro,
      })
      return res.status(404).json({ erro: erro });
    }
    const equipamentoId = equipamento.id;

    const ecopontoEquipamento = await EcopontoEquipamento.findOne({ where: { equipamentoId: equipamentoId, ativo: true } });
    if (!ecopontoEquipamento) {
      const erro = `O equipamento ${codigoEquipamento} não tem um ecoponto associado`;
      await EcopontoLogs.create({
        codigoEquipamento: codigoEquipamento,
        detalhes: erro,
      })
      return res.status(404).json({ erro: erro });
    }
    const ecopontoId = ecopontoEquipamento.ecopontoId;

    const ecoponto = await Ecoponto.findByPk(ecopontoId);
    if (!ecoponto) {
      const erro = `O ecoponto que estava associado ao equipamento ${codigoEquipamento} já não existe`;
      await EcopontoLogs.create({
        codigoEquipamento: codigoEquipamento,
        detalhes: erro,
      })
      return res.status(404).json({ erro: erro });
    }

    const deposito = await Deposito.findByPk(ecoponto.depositoId);
    if (!deposito) {
      const erro = `O deposito associado ao ecoponto ${ecoponto.codigo} já não existe`;
      await EcopontoLogs.create({
        codigoEquipamento: codigoEquipamento,
        codigoEcoponto: ecoponto.codigo,
        detalhes: erro,
      })
      return res.status(404).json({ erro: "Depósito associado ao ecoponto não encontrado" });
    }

    const capacidadeTotal = deposito.capacidadeTotal;
    const altura = deposito.altura;

    const m = profundidade / 100;
    if (m > altura) {
      await ecoponto.update({ capacidadeAtual: 0 });
      const erro = "Medição superior à capacidade do depósito";
      await EcopontoLogs.create({
        codigoEquipamento: codigoEquipamento,
        codigoEcoponto: ecoponto.codigo,
        detalhes: erro,
      })
      return res.status(404).json({erro: erro})
    }

    const percentagem = m / altura;
    const capacidadeRestante = percentagem * capacidadeTotal;
    const capacidadeAtual = capacidadeTotal - capacidadeRestante.toPrecision(2);

    await ecoponto.update({ capacidadeAtual: capacidadeAtual, ultimaLeitura: new Date() }); 
    const mensagem = `Equipamento: ${codigoEquipamento}\n Medição: ${profundidade}cm\n Ecoponto: ${ecoponto.codigo}\n Ocupação: ${capacidadeAtual.toFixed(1)} m³\n Percentagem: ${100-percentagem.toFixed(2)*100}%`;
      await EcopontoLogs.create({
        codigoEquipamento: codigoEquipamento,
        codigoEcoponto: ecoponto.codigo,
        detalhes: mensagem,
      })

    res.json("simmmm", ecoponto);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

async function enviarCoordenadas(req, res) {
  try {
    const whereClause = (req);
    const empresaId = req.body?.empresaId || req.query?.empresaId;

    if (req.user.superAdmin && empresaId) {
      whereClause.empresaId = empresaId;
    }

    const ecopontos = await Ecoponto.findAll({
      where: whereClause,
      order: [["id", "ASC"]],
      include: [
        {
          model: Deposito,
          required: true,
          attributes: ["id", "capacidadeTotal", "tipoDepositoId"],
          include: [
            {
              model: TipoDeposito,
              attributes: ["id", "tipo"]
            }
          ]
        }
      ]
    });

    const coordenadas = ecopontos.map((ecoponto) => {
      const deposito = ecoponto.Deposito;
      const percentagem = ecoponto.capacidadeAtual / deposito.capacidadeTotal * 100;

      return {
        codigo: ecoponto.codigo,
        empresaId: ecoponto.empresaId,
        percentagem: percentagem,
        latitude: ecoponto.latitude,
        longitude: ecoponto.longitude,
        depositoId: deposito.id,
        tipoDepositoId: deposito.tipoDepositoId,
        tipoDeposito: deposito.TipoDeposito?.tipo
      };
    });

    res.json(coordenadas);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      erro: "Erro ao obter coordenadas"
    });
  }
}

router.get("/coordenadas", autenticarJWT, carregarUtilizador, enviarCoordenadas);
router.post("/coordenadas", autenticarJWT, carregarUtilizador, enviarCoordenadas);

module.exports = router;
