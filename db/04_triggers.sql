CREATE TRIGGER trg_atualizado_em
BEFORE UPDATE ON Ecoponto_Equipamento
FOR EACH ROW
EXECUTE FUNCTION atualiza_atualizado_em();