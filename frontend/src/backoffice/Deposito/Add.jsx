import { useState } from "react";

export default function AddDeposito() {
  const [capacidadeTotal, setCapacidadeTotal] = useState("");
  const [altura, setAltura] = useState("");
  const [tipoDepositoId, setTipoDepositoId] = useState("");
  const [descricao, setDescricao] = useState("");
  const [status, setStatus] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("Sending...");

    const payload = [{
      capacidadeTotal: capacidadeTotal ? Number(capacidadeTotal) : null,
      altura: altura ? Number(altura) : null,
      tipoDepositoId: tipoDepositoId ? Number(tipoDepositoId) : null,
      descricao,
    }];

    try {
      const res = await fetch("http://localhost:3000/deposito/inserir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const payload = await res.json();
        throw new Error(payload.erro || "Failed to add depósito");
      }

      setStatus("Depósito added successfully.");
      setCapacidadeTotal("");
      setAltura("");
      setTipoDepositoId("");
      setDescricao("");
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  }

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Add Depósito</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 560 }}>
        <label>
          Capacidade Total
          <input type="number" value={capacidadeTotal} onChange={(e) => setCapacidadeTotal(e.target.value)} placeholder="Capacidade total" />
        </label>
        <label>
          Altura
          <input type="number" value={altura} onChange={(e) => setAltura(e.target.value)} placeholder="Altura" />
        </label>
        <label>
          Tipo Depósito ID
          <input value={tipoDepositoId} onChange={(e) => setTipoDepositoId(e.target.value)} placeholder="Tipo Depósito ID" />
        </label>
        <label>
          Descrição
          <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descrição" rows={4} />
        </label>
        <button type="submit" style={{ padding: "10px 14px", borderRadius: 6, cursor: "pointer" }}>
          Create Depósito
        </button>
      </form>
      {status && <div style={{ marginTop: 12, color: status.startsWith("Error") ? "#b91c1c" : "#166534" }}>{status}</div>}
    </div>
  );
}
