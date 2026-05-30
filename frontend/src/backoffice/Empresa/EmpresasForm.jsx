import { useState, useEffect } from 'react';
import { apiRequest } from "../../middleware/request";

export default function EmpresasForm({ empresa, onNavigate }) {
  const [nome, setNome] = useState("");
  const [nif, setNif] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [status, setStatus] = useState("");

  const isEditMode = !!empresa;

  useEffect(() => {
    if (isEditMode && empresa) {
      setNome(empresa.nome ?? "");
      setNif(empresa.nif ?? "");
      setEmail(empresa.email ?? "");
      setTelefone(empresa.telefone ?? "");
    }
  }, [empresa, isEditMode]);

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("Sending...");

    if (isEditMode && !empresa?.id) {
      setStatus("Unable to update: missing empresa information.");
      return;
    }

    const payload = {
      nome,
      nif,
      email,
      telefone,
    };

    try {
      const endpoint = isEditMode
        ? `http://localhost:3000/empresa/atualizar/${empresa.id}`
        : "http://localhost:3000/empresa/inserir";

      const method = isEditMode ? "PUT" : "POST";
      const requestData = isEditMode ? payload : [payload];

      await apiRequest(endpoint, method, requestData);

      if (isEditMode) {
        setStatus("Empresa updated successfully.");
        if (onNavigate) onNavigate("empresas");
      } else {
        setStatus("Empresa added successfully.");
        setNome("");
        setNif("");
        setEmail("");
        setTelefone("");
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  }

  if (isEditMode && !empresa) {
    return (
      <div>
        <h2 style={{ marginTop: 0 }}>Edit Empresa</h2>
        <p style={{ color: "#b91c1c" }}>No empresa selected.</p>
        <button
          onClick={() => onNavigate("empresas")}
          style={{ padding: "10px 16px", borderRadius: 6, border: "1px solid #3b82f6", background: "#3b82f6", color: "white", cursor: "pointer" }}
        >
          Back to Empresas
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>{isEditMode ? "Edit Empresa" : "Add Empresa"}</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 400 }}>
        <label>
          Nome:
          <input
            type="text"
            value={nome}
            onChange={e => setNome(e.target.value)}
            required
            style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #d1d5db" }}
          />
        </label>
        <label>
          NIF:
          <input
            type="text"
            value={nif}
            onChange={e => setNif(e.target.value)}
            required
            style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #d1d5db" }}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #d1d5db" }}
          />
        </label>
        <label>
          Telefone:
          <input
            type="text"
            value={telefone}
            onChange={e => setTelefone(e.target.value)}
            required
            style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #d1d5db" }}
          />
        </label>
        <button
          type="submit"
          style={{ padding: "10px 16px", borderRadius: 6, border: "1px solid #3b82f6", background: "#3b82f6", color: "white", cursor: "pointer" }}
        >
          {isEditMode ? "Update Empresa" : "Add Empresa"}
        </button>
      </form>
      {status && <p style={{ marginTop: 12 }}>{status}</p>}
    </div>
  );
}