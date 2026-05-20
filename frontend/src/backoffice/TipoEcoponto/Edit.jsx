import { useEffect, useState } from "react";

export default function EditTipoEcoponto({ tipoEcoponto, onNavigate }) {
  const [tipo, setTipo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!tipoEcoponto) return;
    setTipo(tipoEcoponto.tipo ?? "");
    setDescricao(tipoEcoponto.descricao ?? "");
  }, [tipoEcoponto]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!tipoEcoponto?.id) {
      setStatus("Unable to update: missing tipo ecoponto information.");
      return;
    }

    setStatus("Saving changes...");

    const payload = {
      tipo,
      descricao,
    };

    try {
      const res = await fetch(`http://localhost:3000/tipoecoponto/atualizar/${tipoEcoponto.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const payload = await res.json();
        throw new Error(payload.erro || "Failed to update tipo ecoponto");
      }

      setStatus("Tipo Ecoponto updated successfully.");
      onNavigate("tipoecopontos");
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  }

  if (!tipoEcoponto) {
    return (
      <div>
        <h2 style={{ marginTop: 0 }}>Edit Tipo Ecoponto</h2>
        <p style={{ color: "#b91c1c" }}>No tipo ecoponto selected.</p>
        <button onClick={() => onNavigate("tipoecopontos")} style={{ padding: "10px 14px", borderRadius: 6, cursor: "pointer" }}>
          Back to Tipo Ecopontos
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <h2 style={{ marginTop: 0 }}>Edit Tipo Ecoponto #{tipoEcoponto.id}</h2>
        <button onClick={() => onNavigate("tipoecopontos")} style={{ padding: "10px 14px", borderRadius: 6, cursor: "pointer" }}>
          Cancel
        </button>
      </div>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 560 }}>
        <label>
          Tipo
          <input value={tipo} onChange={(e) => setTipo(e.target.value)} placeholder="Tipo" />
        </label>
        <label>
          Descrição
          <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descrição" rows={4} />
        </label>
        <button type="submit" style={{ padding: "10px 14px", borderRadius: 6, cursor: "pointer" }}>
          Save Changes
        </button>
      </form>
      {status && <div style={{ marginTop: 12, color: status.startsWith("Error") ? "#b91c1c" : "#166534" }}>{status}</div>}
    </div>
  );
}
