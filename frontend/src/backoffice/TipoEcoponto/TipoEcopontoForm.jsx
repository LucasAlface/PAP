import { useEffect, useState } from "react";
import { apiRequest } from "../../middleware/request";

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
        ? `http://localhost:3000/tipoecoponto/atualizar/${tipoEcoponto.id}`
        : "http://localhost:3000/tipoecoponto/inserir";

      const method = isEditMode ? "PUT" : "POST";
      const requestData = isEditMode ? payload : payload;

      await apiRequest(endpoint, method, requestData);

      if (isEditMode) {
        setStatus("Tipo Ecoponto updated successfully.");
        if (onNavigate) onNavigate("tipoecopontos");
      } else {
        setStatus("Tipo Ecoponto added successfully.");
        setTipo("");
        setDescricao("");
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  }

  if (isEditMode && !tipoEcoponto) {
    return (
      <div>
        <h2 style={{ marginTop: 0 }}>Edit Tipo Ecoponto</h2>
        <p style={{ color: "#b91c1c" }}>No tipo ecoponto selected.</p>
        <button
          onClick={() => onNavigate("tipoecopontos")}
          style={{ padding: "10px 14px", borderRadius: 6, cursor: "pointer" }}
        >
          Back to Tipo Ecopontos
        </button>
      </div>
    );
  }

  return (
    <div>
      {isEditMode ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <h2 style={{ marginTop: 0 }}>Edit Tipo Ecoponto #{tipoEcoponto.id}</h2>
          <button
            onClick={() => onNavigate("tipoecopontos")}
            style={{ padding: "10px 14px", borderRadius: 6, border: "none", background: "#3b82f6", color: "white", cursor: "pointer" }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <h2 style={{ marginTop: 0 }}>Add Tipo Ecoponto</h2>
      )}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 560 }}>
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
        <button type="submit" style={{ padding: "10px 14px", borderRadius: 6, border: "none", background: "#3b82f6", color: "white", cursor: "pointer" }}>
          {isEditMode ? "Save Changes" : "Create Tipo Ecoponto"}
        </button>
      </form>

      {status && (
        <div
          style={{
            marginTop: 12,
            color: status.startsWith("Error") ? "#b91c1c" : "#166534",
          }}
        >
          {status}
        </div>
      )}
    </div>
  );
}
