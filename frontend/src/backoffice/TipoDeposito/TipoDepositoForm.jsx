import { useEffect, useState } from "react";
import { apiRequest } from "../../middleware/request";
import FormTemplate from "../FormTemplate.jsx";

export default function TipoDepositoForm({ tipoDeposito, onNavigate }) {
  const [tipo, setTipo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [status, setStatus] = useState("");

  const isEditMode = !!tipoDeposito;

  useEffect(() => {
    if (isEditMode && tipoDeposito) {
      setTipo(tipoDeposito.tipo ?? "");
      setDescricao(tipoDeposito.descricao ?? "");
    }
  }, [tipoDeposito, isEditMode]);

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("Sending...");

    if (isEditMode && !tipoDeposito?.id) {
      setStatus("Unable to update: missing tipo depósito information.");
      return;
    }

    const payload = {
      tipo,
      descricao,
    };

    try {
      const endpoint = isEditMode
        ? `/tipodeposito/atualizar/${tipoDeposito.id}`
        : `/tipodeposito/inserir`;

      const method = isEditMode ? "PUT" : "POST";
      const requestData = isEditMode ? payload : payload;

      await apiRequest(endpoint, method, requestData);

      if (isEditMode) {
        setStatus("Tipo Depósito updated successfully.");
        if (onNavigate) onNavigate("tipodepositos");
      } else {
        setStatus("Tipo Depósito added successfully.");
        setTipo("");
        setDescricao("");
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  }

  return (
    <FormTemplate
      isEditMode={isEditMode}
      entityName="Tipo Depósito"
      entityId={tipoDeposito?.id}
      hasEntity={!!tipoDeposito}
      onCancel={() => onNavigate("tipodepositos")}
      onSubmit={handleSubmit}
      status={status}
      backLabel="Back to Tipo Depósitos"
    >
      <label>
        Tipo
        <input
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          placeholder="Tipo"
        />
      </label>
      <label>
        Descrição
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Descrição"
          rows={4}
        />
      </label>
    </FormTemplate>
  );
}
