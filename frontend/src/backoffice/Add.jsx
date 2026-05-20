import { useState } from "react";

export default function Add() {
  const [codigo, setCodigo] = useState("");
  const [tipoEcopontoId, setTipoEcopontoId] = useState("");
  const [depositoId, setDepositoId] = useState("");
  const [capacidadeAtual, setCapacidadeAtual] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [descricao, setDescricao] = useState("");
  const [status, setStatus] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("Sending...");

    const payload = [{
      codigo,
      tipoEcopontoId: tipoEcopontoId ? Number(tipoEcopontoId) : null,
      depositoId: depositoId ? Number(depositoId) : null,
      capacidadeAtual: capacidadeAtual ? Number(capacidadeAtual) : null,
      latitude: latitude ? Number(latitude) : null,
      longitude: longitude ? Number(longitude) : null,
      descricao,
    }];

    try {
      const res = await fetch("http://localhost:3000/ecoponto/inserir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const payload = await res.json();
        throw new Error(payload.erro || "Failed to add ecoponto");
      }

      setStatus("Ecoponto added successfully.");
      setCodigo("");
      setTipoEcopontoId("");
      setDepositoId("");
      setCapacidadeAtual("");
      setLatitude("");
      setLongitude("");
      setDescricao("");
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  }

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Add Ecoponto</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 560 }}>
        <label>
          Código
          <input value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="Ecoponto code" />
        </label>
        <label>
          Tipo Ecoponto ID
          <input value={tipoEcopontoId} onChange={(e) => setTipoEcopontoId(e.target.value)} placeholder="Tipo Ecoponto ID" />
        </label>
        <label>
          Depósito ID
          <input value={depositoId} onChange={(e) => setDepositoId(e.target.value)} placeholder="Depósito ID" />
        </label>
        <label>
          Capacidade Atual
          <input value={capacidadeAtual} onChange={(e) => setCapacidadeAtual(e.target.value)} placeholder="Capacidade atual" />
        </label>
        <label>
          Latitude
          <input value={latitude} onChange={(e) => setLatitude(e.target.value)} placeholder="Latitude" />
        </label>
        <label>
          Longitude
          <input value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="Longitude" />
        </label>
        <label>
          Descrição
          <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descrição" rows={4} />
        </label>
        <button type="submit" style={{ padding: "10px 14px", borderRadius: 6, cursor: "pointer" }}>
          Create Ecoponto
        </button>
      </form>
      {status && <div style={{ marginTop: 12, color: status.startsWith("Error") ? "#b91c1c" : "#166534" }}>{status}</div>}
    </div>
  );
}
