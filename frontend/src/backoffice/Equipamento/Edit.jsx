import { useEffect, useState } from "react";

export default function EditEquipamento({ equipamento, onNavigate }) {
  const [codigo, setCodigo] = useState("");
  const [ativo, setAtivo] = useState("true");
  const [bateria, setBateria] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!equipamento) return;
    setCodigo(equipamento.codigo ?? "");
    setAtivo(equipamento.ativo ? "true" : "false");
    setBateria(equipamento.bateria ?? "");
  }, [equipamento]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!equipamento?.id) {
      setStatus("Unable to update: missing equipamento information.");
      return;
    }

    setStatus("Saving changes...");
    const payload = {
      codigo,
      ativo: ativo === "true",
      bateria: bateria ? Number(bateria) : null,
    };

    try {
      const res = await fetch(`http://localhost:3000/equipamento/atualizar/${equipamento.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const payload = await res.json();
        throw new Error(payload.erro || "Failed to update equipamento");
      }

      setStatus("Equipamento updated successfully.");
      onNavigate("equipamentos");
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  }

  if (!equipamento) {
    return (
      <div>
        <h2 style={{ marginTop: 0 }}>Edit Equipamento</h2>
        <p style={{ color: "#b91c1c" }}>No equipamento selected.</p>
        <button onClick={() => onNavigate("equipamentos")} style={{ padding: "10px 14px", borderRadius: 6, cursor: "pointer" }}>
          Back to Equipamentos
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <h2 style={{ marginTop: 0 }}>Edit Equipamento #{equipamento.id}</h2>
        <button onClick={() => onNavigate("equipamentos")} style={{ padding: "10px 14px", borderRadius: 6, cursor: "pointer" }}>
          Cancel
        </button>
      </div>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 560 }}>
        <label>
          Código
          <input value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="Equipamento code" />
        </label>
        <label>
          Ativo
          <select value={ativo} onChange={(e) => setAtivo(e.target.value)}>
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </select>
        </label>
        <label>
          Bateria
          <input type="number" value={bateria} onChange={(e) => setBateria(e.target.value)} placeholder="Bateria" />
        </label>
        <button type="submit" style={{ padding: "10px 14px", borderRadius: 6, cursor: "pointer" }}>
          Save Changes
        </button>
      </form>
      {status && <div style={{ marginTop: 12, color: status.startsWith("Error") ? "#b91c1c" : "#166534" }}>{status}</div>}
    </div>
  );
}
