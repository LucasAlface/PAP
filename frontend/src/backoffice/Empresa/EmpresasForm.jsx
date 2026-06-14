import { useState, useEffect } from 'react';
import { apiRequest } from "../../middleware/request";
import FormTemplate from "../FormTemplate.jsx";

export default function EmpresasForm({ empresa, onNavigate, mapCoordinates }) {
  const [nome, setNome] = useState("");
  const [nif, setNif] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [status, setStatus] = useState("");

  const isEditMode = !!empresa;

  useEffect(() => {
    if (isEditMode && empresa) {
      setNome(empresa.nome ?? "");
      setNif(empresa.nif ?? "");
      setEmail(empresa.email ?? "");
      setTelefone(empresa.telefone ?? "");
      setLatitude(empresa.latitude ?? "");
      setLongitude(empresa.longitude ?? "");
    }
  }, [empresa, isEditMode]);

  useEffect(() => {
    if (!mapCoordinates) return;

    setLatitude(String(mapCoordinates.latitude ?? ""));
    setLongitude(String(mapCoordinates.longitude ?? ""));
  }, [mapCoordinates]);

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
      latitude: latitude ? Number(latitude) : null,
      longitude: longitude ? Number(longitude) : null,
    };

    try {
      const endpoint = isEditMode
        ? `/empresa/atualizar/${empresa.id}`
        : `/empresa/inserir`;

      const method = isEditMode ? "PUT" : "POST";
      const requestData = isEditMode ? payload : payload;

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
        setLatitude("");
        setLongitude("");
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  }

  return (
    <FormTemplate
      isEditMode={isEditMode}
      entityName="Empresa"
      entityId={empresa?.id}
      hasEntity={!!empresa}
      onCancel={() => onNavigate("empresas")}
      onSubmit={handleSubmit}
      status={status}
      backLabel="Back to Empresas"
      submitLabel={isEditMode ? "Update Empresa" : "Add Empresa"}
    >
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
      <label>
        Latitude:
        <input
          type="number"
          value={latitude}
          onChange={e => setLatitude(e.target.value)}
          style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #d1d5db" }}
        />
      </label>
      <label>
        Longitude:
        <input
          type="number"
          value={longitude}
          onChange={e => setLongitude(e.target.value)}
          style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #d1d5db" }}
        />
      </label>
    </FormTemplate>
  );
}
    
