import { useState } from "react";

export default function AddTipoDeposito() {
  const [tipo, setTipo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [status, setStatus] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("Sending...");

    const payload = [{
      tipo,
      descricao,
    }];

    try {
      const res = await fetch("http://localhost:3000/tipodeposito/inserir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const payload = await res.json();
        throw new Error(payload.erro || "Failed to add tipo depósito");
      }

      setStatus("Tipo Depósito added successfully.");
      setTipo("");
      setDescricao("");
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  }

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Add Tipo Depósito</h2>
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
          Create Tipo Depósito
        </button>
      </form>
      {status && <div style={{ marginTop: 12, color: status.startsWith("Error") ? "#b91c1c" : "#166534" }}>{status}</div>}
    </div>
  );
}
