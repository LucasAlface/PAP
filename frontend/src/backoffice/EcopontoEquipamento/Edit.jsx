import { useEffect, useState } from "react";

export default function EditEcopontoEquipamento({ ecopontoEquipamento, onNavigate }) {
  const [ecopontoId, setEcopontoId] = useState("");
  const [equipamentoId, setEquipamentoId] = useState("");
  const [ativo, setAtivo] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!ecopontoEquipamento) return;
    setEcopontoId(ecopontoEquipamento.ecopontoId ?? "");
    setEquipamentoId(ecopontoEquipamento.equipamentoId ?? "");
    setAtivo(ecopontoEquipamento.ativo ? "true" : "false");
  }, [ecopontoEquipamento]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!ecopontoEquipamento?.ecopontoId || !ecopontoEquipamento?.equipamentoId) {
      setStatus("Unable to update: missing ecoponto equipamento information.");
      return;
    }

    setStatus("Saving changes...");

    const payload = {
      ativo: ativo === "true",
    };

    try {
      const res = await fetch(
        `http://localhost:3000/ecopontoequipamento/atualizar/${ecopontoEquipamento.ecopontoId}/${ecopontoEquipamento.equipamentoId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const payload = await res.json();
        throw new Error(payload.erro || "Failed to update ecoponto equipamento");
      }

      setStatus("Ecoponto Equipamento updated successfully.");
      onNavigate("ecopontoequipamentos");
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  }

  if (!ecopontoEquipamento) {
    return (
      <div>
        <h2 style={{ marginTop: 0 }}>Edit Ecoponto Equipamento</h2>
        <p style={{ color: "#b91c1c" }}>No ecoponto equipamento selected.</p>
        <button onClick={() => onNavigate("ecopontoequipamentos")} style={{ padding: "10px 14px", borderRadius: 6, cursor: "pointer" }}>
          Back to Ecoponto Equipamentos
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <h2 style={{ marginTop: 0 }}>Edit Ecoponto Equipamento</h2>
        <button onClick={() => onNavigate("ecopontoequipamentos")} style={{ padding: "10px 14px", borderRadius: 6, cursor: "pointer" }}>
          Cancel
        </button>
      </div>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 560 }}>
        <label>
          Ecoponto ID
          <input type="number" value={ecopontoId} disabled />
        </label>
        <label>
          Equipamento ID
          <input type="number" value={equipamentoId} disabled />
        </label>
        <label>
          Ativo
          <select value={ativo} onChange={(e) => setAtivo(e.target.value)}>
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </select>
        </label>
        <button type="submit" style={{ padding: "10px 14px", borderRadius: 6, cursor: "pointer" }}>
          Save Changes
        </button>
      </form>
      {status && <div style={{ marginTop: 12, color: status.startsWith("Error") ? "#b91c1c" : "#166534" }}>{status}</div>}
    </div>
  );
}
