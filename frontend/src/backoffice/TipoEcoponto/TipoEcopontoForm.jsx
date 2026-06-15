import { useEffect, useState } from "react";
import { apiRequest } from "../../middleware/request";
import FormTemplate from "../FormTemplate.jsx";

export default function TipoEcopontoForm({ tipoEcoponto, onNavigate }) {
  const [tipo, setTipo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [status, setStatus] = useState("");

  const isEditMode = !!tipoEcoponto;

  useEffect(() => {
    if (isEditMode && tipoEcoponto) {
      setTipo(tipoEcoponto.tipo ?? "");
      setDescricao(tipoEcoponto.descricao ?? "");
    }
  }, [tipoEcoponto, isEditMode]);

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("Sending...");

    if (isEditMode && !tipoEcoponto?.id) {
      setStatus("Unable to update: missing tipo ecoponto information.");
      return;
    }

    const payload = {
      tipo,
      descricao,
    };

    try {
      const endpoint = isEditMode
        ? `/tipoecoponto/atualizar/${tipoEcoponto.id}`
        : `/tipoecoponto/inserir`;

      const method = isEditMode ? "PUT" : "POST";
      const requestData = isEditMode ? payload : payload;

      await apiRequest(endpoint, method, requestData);

      if (isEditMode) {
        setStatus("Tipo Ecoponto updated successfully.");
        if (onNavigate) onNavigate("tipoecopontos");
      } else {
        setStatus("Tipo Ecoponto added successfully.");
        if (onNavigate) {
          onNavigate("tipoecopontos");
          return;
        }
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
      entityName="Tipo Ecoponto"
      entityId={tipoEcoponto?.id}
      hasEntity={!!tipoEcoponto}
      onCancel={() => onNavigate("tipoecopontos")}
      onSubmit={handleSubmit}
      status={status}
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
