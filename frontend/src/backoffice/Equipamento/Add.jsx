import { useState } from "react";

export default function AddEquipamento() {
  const [codigo, setCodigo] = useState("");
  const [ativo, setAtivo] = useState("");
  const [status, setStatus] = useState("");


  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("Sending...");

    const payload = [{
      codigo,
      ativo,
    }];

    try {
      const res = await fetch("http://localhost:3000/equipamento/inserir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const payload = await res.json();
        throw new Error(payload.erro || "Failed to add equipamento");
      }

      setStatus("Equipamento added successfully.");
      setCodigo("");
      setAtivo("");
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  }

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Add Equipamento</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 560 }}>
        <label>
          Código
          <input value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="Equipamento code" />
        </label>
        <label>
          Ativo
          <select value={ativo} onChange={(e) => setAtivo(e.target.value)}>
            <option value="">Select status</option>
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </select>
        </label>
        <button type="submit" style={{ padding: "10px 14px", borderRadius: 6, cursor: "pointer" }}>
          Create Equipamento
        </button>
      </form>
      {status && <div style={{ marginTop: 12, color: status.startsWith("Error") ? "#b91c1c" : "#166534" }}>{status}</div>}
    </div>
  );
}
