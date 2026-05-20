import { useState } from "react";

export default function AddEcopontoEquipamento() {
  const [ecopontoId, setEcopontoId] = useState("");
  const [equipamentoId, setEquipamentoId] = useState("");
  const [ativo, setAtivo] = useState("true");
  const [status, setStatus] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("Sending...");

    const payload = [{
      ecopontoId: ecopontoId ? Number(ecopontoId) : null,
      equipamentoId: equipamentoId ? Number(equipamentoId) : null,
      ativo: ativo === "true",
    }];

    try {
      const res = await fetch("http://localhost:3000/ecopontoequipamento/inserir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const payload = await res.json();
        throw new Error(payload.erro || "Failed to add ecoponto equipamento");
      }

      setStatus("Ecoponto Equipamento added successfully.");
      setEcopontoId("");
      setEquipamentoId("");
      setAtivo("true");
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  }

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Add Ecoponto Equipamento</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 560 }}>
        <label>
          Ecoponto ID
          <input type="number" value={ecopontoId} onChange={(e) => setEcopontoId(e.target.value)} placeholder="Ecoponto ID" />
        </label>
        <label>
          Equipamento ID
          <input type="number" value={equipamentoId} onChange={(e) => setEquipamentoId(e.target.value)} placeholder="Equipamento ID" />
        </label>
        <label>
          Ativo
          <select value={ativo} onChange={(e) => setAtivo(e.target.value)}>
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </select>
        </label>
        <button type="submit" style={{ padding: "10px 14px", borderRadius: 6, cursor: "pointer" }}>
          Create Ecoponto Equipamento
        </button>
      </form>
      {status && <div style={{ marginTop: 12, color: status.startsWith("Error") ? "#b91c1c" : "#166534" }}>{status}</div>}
    </div>
  );
}
