DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

CREATE TABLE Tipo_ecoponto (
  id SERIAL PRIMARY KEY,
  tipo TEXT,
  descricao TEXT
);

CREATE TABLE Tipo_deposito (
  id SERIAL PRIMARY KEY,
  tipo TEXT,
  descricao TEXT
);

CREATE TABLE Deposito (
  id SERIAL PRIMARY KEY,
  capacidadeTotal FLOAT,
  altura FLOAT,
  tipoDepositoId INT REFERENCES Tipo_deposito(id),
  descricao TEXT
);

CREATE TABLE Ecoponto (
  id SERIAL PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  tipoEcopontoId INT REFERENCES Tipo_ecoponto(id),
  depositoId INT REFERENCES Deposito(id),
  capacidadeAtual FLOAT,
  latitude DECIMAL,
  longitude DECIMAL,
  descricao TEXT
);

CREATE TABLE Equipamento (
  id SERIAL PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  ativo BOOLEAN DEFAULT FALSE,
  bateria DECIMAL
);

CREATE TABLE Ecoponto_Equipamento (
  ecopontoId INT NOT NULL REFERENCES ecoponto(id),
  equipamentoId INT NOT NULL REFERENCES equipamento(id),
  ativo BOOLEAN DEFAULT FALSE,
  criado_em timestamp DEFAULT now(),
  atualizado_em timestamp DEFAULT now(),
  PRIMARY KEY (ecopontoId, equipamentoId)
);

CREATE TABLE Ecoponto_logs (
  id SERIAL PRIMARY KEY,
  ecopontoId INT REFERENCES ecoponto(id) NOT NULL,
  equipamentoId INT REFERENCES equipamento(id) NOT NULL,
  detalhes TEXT,
  hora timestamp DEFAULT now()
);
