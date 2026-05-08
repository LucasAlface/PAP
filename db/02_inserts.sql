INSERT INTO tipo_ecoponto (tipo) VALUES
('verde'),
('amarelo'),
('azul');

INSERT INTO tipo_deposito (tipo) VALUES
('superficie'),
('subterraneo');

INSERT INTO deposito (capacidadeTotal, altura, tipoDepositoId, descricao) VALUES
(2.5, 1.0, 1, 'apenas um ecoponto regular'),
(5.0, 2.0, 2, 'subterraneo grande e tal ya');

INSERT INTO ecoponto (codigo, tipoEcopontoId, depositoId, latitude, longitude, descricao) VALUES
('VX5FT', 1, 1, 40.642346, -8.649730, 'um vidrão superficial em aveiro'),
('VX6FT', 2, 1, 40.642346, -8.649730, 'um embalão superficial em aveiro'),
('VX7FT', 3, 1, 40.642346, -8.649730, 'um papelão superficial em aveiro'),
('VX5FS', 1, 2, 40.642346, -8.649730, 'um vidrão subterrâneo em aveiro'),
('VX6FS', 2, 2, 40.642346, -8.649730, 'um embalão subterrâneo em aveiro'),
('VX7FS', 3, 2, 40.642346, -8.649730, 'um papelão subterrâneo em aveiro');

INSERT INTO equipamento (codigo, ativo) VALUES
('ARD001', true),
('ARD002', true),
('ARD003', true);

INSERT INTO ecoponto_equipamento (equipamentoId, ecopontoId, ativo) VALUES
(1, 1, true),
(2, 2, false),
(3, 3, true);