import { useEffect, useState } from "react";

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
        ? `http://localhost:3000/tipodeposito/atualizar/${tipoDeposito.id}`
        : "http://localhost:3000/tipodeposito/inserir";

      const method = isEditMode ? "PUT" : "POST";
      const body = isEditMode ? JSON.stringify(payload) : JSON.stringify([payload]);

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (!res.ok) {
        const errorPayload = await res.json();
        throw new Error(errorPayload.erro || "Failed to save tipo depósito");
      }

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

  if (isEditMode && !tipoDeposito) {
    return (
      <div>
        <h2 style={{ marginTop: 0 }}>Edit Tipo Depósito</h2>
        <p style={{ color: "#b91c1c" }}>No tipo depósito selected.</p>
        <button
          onClick={() => onNavigate("tipodepositos")}
          style={{ padding: "10px 14px", borderRadius: 6, cursor: "pointer" }}
        >
          Back to Tipo Depósitos
        </button>
      </div>
    );
  }

  return (
    <div>
      {isEditMode ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <h2 style={{ marginTop: 0 }}>Edit Tipo Depósito #{tipoDeposito.id}</h2>
          <button
            onClick={() => onNavigate("tipodepositos")}
            style={{ padding: "10px 14px", borderRadius: 6, cursor: "pointer" }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <h2 style={{ marginTop: 0 }}>Add Tipo Depósito</h2>
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
        <button type="submit" style={{ padding: "10px 14px", borderRadius: 6, cursor: "pointer" }}>
          {isEditMode ? "Save Changes" : "Create Tipo Depósito"}
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
