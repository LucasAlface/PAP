CREATE VIEW vw_ecoponto_full AS 
SELECT e.*, te.tipo AS tipoEcoponto, d.capacidadeTotal, d.altura AS alturaDeposito, eeq.equipamentoId, eq.codigo AS codigoEquipamento, eq.bateria
FROM ecoponto as e JOIN tipo_ecoponto as te ON e.tipoEcopontoId = te.id
JOIN deposito as d ON e.depositoId = d.id
JOIN ecoponto_equipamento as eeq ON e.id = eeq.ecopontoId
JOIN equipamento as eq ON eeq.equipamentoId = eq.id
WHERE eeq.ativo = true AND eq.ativo = true;